<?php
/**
 * POST /api/bookings/review.php
 * Header: Authorization: Bearer <token>
 * Body: { bookingId, rating, comment }
 * Returns: { success, data: Review }
 * 
 * Submits a review for a completed booking.
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$auth = requireAuth();
$data = body();

// Validate
$errs = [];
if (empty($data['bookingId'])) $errs['bookingId'] = 'Booking ID is required';
if (empty($data['rating'])) $errs['rating'] = 'Rating is required';
if (!is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
    $errs['rating'] = 'Rating must be between 1 and 5';
}
if ($errs) error('Validation failed', 422, $errs);

$pdo = getDB();

// Fetch booking
$stmt = $pdo->prepare('
    SELECT b.*, t.id as tech_id 
    FROM bookings b
    LEFT JOIN technicians t ON b.technician_id = t.id
    WHERE b.id = ?
');
$stmt->execute([$data['bookingId']]);
$booking = $stmt->fetch();

if (!$booking) error('Booking not found', 404);

// Verify ownership
if ($booking['customer_id'] != $auth['sub']) {
    error('You can only review your own bookings', 403);
}

// Verify booking is completed
if ($booking['status'] !== 'completed') {
    error('You can only review completed bookings', 422);
}

// Check if already reviewed
$stmt = $pdo->prepare('SELECT id FROM reviews WHERE booking_id = ?');
$stmt->execute([$data['bookingId']]);
if ($stmt->fetch()) error('You have already reviewed this booking', 422);

// Create review
$stmt = $pdo->prepare('
    INSERT INTO reviews (booking_id, customer_id, technician_id, service_id, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?)
');
$stmt->execute([
    $data['bookingId'],
    $auth['sub'],
    $booking['tech_id'],
    $booking['service_id'],
    $data['rating'],
    $data['comment'] ?? null,
]);

$reviewId = $pdo->lastInsertId();

// Update technician average rating
if ($booking['tech_id']) {
    $stmt = $pdo->prepare('
        UPDATE technicians 
        SET rating = (SELECT AVG(rating) FROM reviews WHERE technician_id = ?),
            total_reviews = (SELECT COUNT(*) FROM reviews WHERE technician_id = ?)
        WHERE id = ?
    ');
    $stmt->execute([$booking['tech_id'], $booking['tech_id'], $booking['tech_id']]);
}

// Fetch created review
$stmt = $pdo->prepare('SELECT * FROM reviews WHERE id = ?');
$stmt->execute([$reviewId]);
$review = $stmt->fetch();

json(['success' => true, 'data' => $review]);
