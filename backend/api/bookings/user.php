<?php
/**
 * GET /api/bookings/user
 * Header: Authorization: Bearer <token>
 * Returns: { success, data: Booking[], total }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$auth = requireAuth();
$pdo  = getDB();

$stmt = $pdo->prepare('
    SELECT b.id, s.name AS service, u.name AS technician,
           b.scheduled_date AS date, b.scheduled_time AS time,
           b.status, b.amount, b.problem_category AS problemCategory,
           b.description, b.address, b.created_at
    FROM bookings b
    JOIN services s ON s.id = b.service_id
    LEFT JOIN technicians t ON t.id = b.technician_id
    LEFT JOIN users u ON u.id = t.user_id
    WHERE b.customer_id = ?
    ORDER BY b.created_at DESC
');
$stmt->execute([$auth['sub']]);
$bookings = $stmt->fetchAll();

foreach ($bookings as &$b) {
    $b['amount']     = (int) $b['amount'];
    $b['technician'] = $b['technician'] ?? 'Auto Assigned';
}

json(['success' => true, 'data' => $bookings, 'total' => count($bookings)]);
