<?php
/**
 * PATCH /api/bookings/status
 * Header: Authorization: Bearer <token>
 * Body: { id, status }
 * Returns: { success, data: Booking }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') error('Method not allowed', 405);

$auth   = requireAuth();
$data   = body();
$id     = trim($data['id']     ?? '');
$status = trim($data['status'] ?? '');

$allowed = ['confirmed', 'in_progress', 'completed', 'cancelled'];
if (!$id)                        error('Booking ID is required', 422);
if (!in_array($status, $allowed)) error('Invalid status', 422);

$pdo = getDB();

// Customers can only cancel their own bookings
if ($auth['role'] === 'customer') {
    if ($status !== 'cancelled') error('Customers can only cancel bookings', 403);
    $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ? AND customer_id = ?');
    $stmt->execute([$status, $id, $auth['sub']]);
} else {
    // Admins / technicians can set any status
    $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);
}

if ($stmt->rowCount() === 0) error('Booking not found or no change made', 404);

json(['success' => true, 'data' => ['id' => $id, 'status' => $status]]);
