<?php
/**
 * POST /api/payments/verify.php
 * Header: Authorization: Bearer <token> (admin only)
 * Body: { payment_id }
 * Returns: { success, data: Payment }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$auth = requireAuth();
if ($auth['role'] !== 'admin') error('Admin access required', 403);

$data      = body();
$paymentId = (int) ($data['payment_id'] ?? 0);
if (!$paymentId) error('Payment ID is required', 422);

$pdo = getDB();

// Fetch payment
$stmt = $pdo->prepare('SELECT * FROM payments WHERE id = ?');
$stmt->execute([$paymentId]);
$payment = $stmt->fetch();
if (!$payment) error('Payment not found', 404);
if ($payment['status'] === 'completed') error('Payment already verified', 409);

// Update to completed
$stmt = $pdo->prepare('UPDATE payments SET status = ? WHERE id = ?');
$stmt->execute(['completed', $paymentId]);

// Also update booking payment_status
$stmt = $pdo->prepare('UPDATE bookings SET payment_status = ? WHERE id = ?');
$stmt->execute(['paid', $payment['booking_id']]);

json([
    'success' => true,
    'data'    => array_merge($payment, ['status' => 'completed']),
]);
