<?php
/**
 * PATCH /api/bookings/status.php
 * Header: Authorization: Bearer <token>
 * Body: { id, status, cancelledReason? }
 * Returns: { success, data: Booking }
 * 
 * Updates booking status. Validates ownership and role permissions.
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

// CRITICAL: CORS headers MUST come before session_start()
cors();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') error('Method not allowed', 405);

$auth = requireAuth();
$data = body();

// Validate
if (empty($data['id'])) error('Booking ID is required', 422);
if (empty($data['status'])) error('Status is required', 422);

$validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
if (!in_array($data['status'], $validStatuses)) {
    error('Invalid status', 422);
}

$pdo = getDB();

// Fetch booking
$stmt = $pdo->prepare('SELECT * FROM bookings WHERE id = ?');
$stmt->execute([$data['id']]);
$booking = $stmt->fetch();

if (!$booking) error('Booking not found', 404);

// Authorization check
$isOwner = $booking['customer_id'] == $auth['sub'];
$isAdmin = $auth['role'] === 'admin';
$isTech  = $auth['role'] === 'technician' && $booking['technician_id'] == $auth['sub'];

if (!$isOwner && !$isAdmin && !$isTech) {
    error('You do not have permission to update this booking', 403);
}

// Update booking
$cancelledReason = $data['status'] === 'cancelled' ? ($data['cancelledReason'] ?? null) : null;

$stmt = $pdo->prepare('
    UPDATE bookings 
    SET status = ?, cancelled_reason = ?, updated_at = NOW()
    WHERE id = ?
');
$stmt->execute([$data['status'], $cancelledReason, $data['id']]);

// If completed, update payment status
if ($data['status'] === 'completed') {
    $pdo->prepare('UPDATE payments SET status = ? WHERE booking_id = ?')
        ->execute(['completed', $data['id']]);
}

// Fetch updated booking with joins
$stmt = $pdo->prepare('
    SELECT 
        b.*,
        s.name as service_name,
        s.icon as service_icon,
        t.name as technician_name,
        t.phone as technician_phone,
        u.name as customer_name,
        u.phone as customer_phone
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    LEFT JOIN technicians t ON b.technician_id = t.id
    JOIN users u ON b.customer_id = u.id
    WHERE b.id = ?
');
$stmt->execute([$data['id']]);
$updated = $stmt->fetch();

json(['success' => true, 'data' => $updated]);
