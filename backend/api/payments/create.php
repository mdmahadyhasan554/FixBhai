<?php
/**
 * POST /api/payments/create.php
 * Header: Authorization: Bearer <token>
 * Body: { booking_id, amount, payment_method, transaction_id? }
 * Returns: { success, data: Payment }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$auth = requireAuth();
$data = body();

// ── Validate ──────────────────────────────────────────────
$errs = [];
if (empty($data['booking_id']))     $errs['booking_id']     = 'Booking ID is required';
if (empty($data['amount']))         $errs['amount']         = 'Amount is required';
if (empty($data['payment_method'])) $errs['payment_method'] = 'Payment method is required';

$allowed = ['bkash', 'nagad', 'rocket', 'cash'];
if (!in_array($data['payment_method'] ?? '', $allowed))
    $errs['payment_method'] = 'Invalid payment method';

// Transaction ID required for mobile banking
if (in_array($data['payment_method'] ?? '', ['bkash', 'nagad', 'rocket'])
    && empty(trim($data['transaction_id'] ?? '')))
    $errs['transaction_id'] = 'Transaction ID is required for mobile banking';

if ($errs) error('Validation failed', 422, $errs);

// Sanitize transaction ID
$txnId = !empty($data['transaction_id'])
    ? preg_replace('/[^A-Za-z0-9\-_]/', '', trim($data['transaction_id']))
    : null;

$pdo = getDB();

// ── Prevent duplicate transaction ID ─────────────────────
if ($txnId) {
    $stmt = $pdo->prepare('SELECT id FROM payments WHERE transaction_id = ?');
    $stmt->execute([$txnId]);
    if ($stmt->fetch()) error('This transaction ID has already been used', 409);
}

// ── Insert payment ────────────────────────────────────────
$stmt = $pdo->prepare('
    INSERT INTO payments (user_id, booking_id, amount, payment_method, transaction_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
');
$stmt->execute([
    $auth['sub'],
    $data['booking_id'],
    (float) $data['amount'],
    $data['payment_method'],
    $txnId,
    'pending',
]);

$paymentId = (int) $pdo->lastInsertId();

json([
    'success' => true,
    'data'    => [
        'id'             => $paymentId,
        'booking_id'     => $data['booking_id'],
        'amount'         => (float) $data['amount'],
        'payment_method' => $data['payment_method'],
        'transaction_id' => $txnId,
        'status'         => 'pending',
    ],
], 201);
