<?php
/**
 * GET /api/payments/user.php
 * Header: Authorization: Bearer <token>
 * Returns: { success, data: Payment[], total }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$auth = requireAuth();
$pdo  = getDB();

$stmt = $pdo->prepare('
    SELECT p.id, p.booking_id, p.amount, p.payment_method,
           p.transaction_id, p.status, p.created_at,
           s.name AS service_name
    FROM payments p
    LEFT JOIN bookings b ON b.id = p.booking_id
    LEFT JOIN services s ON s.id = b.service_id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
');
$stmt->execute([$auth['sub']]);
$payments = $stmt->fetchAll();

foreach ($payments as &$p) {
    $p['amount'] = (float) $p['amount'];
}

json(['success' => true, 'data' => $payments, 'total' => count($payments)]);
