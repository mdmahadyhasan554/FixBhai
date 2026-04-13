<?php
/**
 * GET /api/admin/bookings
 * Returns: { success, data: Booking[] }
 * Admin only - Get all bookings
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

// CRITICAL: CORS headers MUST come before session_start()
cors();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$auth = requireAuth();

// Only admins can access this endpoint
if ($auth['role'] !== 'admin') {
    error('Admin access required', 403);
}

$pdo = getDB();

// Get all bookings with customer, technician, and service details
$stmt = $pdo->prepare('
    SELECT 
        b.id,
        b.status,
        b.scheduled_date AS date,
        b.scheduled_time AS time,
        b.address,
        b.problem_category AS problemCategory,
        b.description,
        b.notes,
        b.amount,
        b.payment_status,
        b.payment_method,
        b.transaction_id,
        b.cancelled_reason,
        b.created_at,
        b.updated_at,
        s.name AS service,
        s.icon AS service_icon,
        s.color AS service_color,
        customer.id AS customer_id,
        customer.name AS customer_name,
        customer.email AS customer_email,
        customer.phone AS customer_phone,
        tech_user.id AS technician_id,
        tech_user.name AS technician_name,
        tech_user.phone AS technician_phone
    FROM bookings b
    JOIN services s ON s.id = b.service_id
    JOIN users customer ON customer.id = b.customer_id
    LEFT JOIN technicians t ON t.id = b.technician_id
    LEFT JOIN users tech_user ON tech_user.id = t.user_id
    ORDER BY b.created_at DESC
');
$stmt->execute();
$bookings = $stmt->fetchAll();

// Format the data
foreach ($bookings as &$booking) {
    $booking['amount'] = (float) $booking['amount'];
    $booking['technician'] = $booking['technician_name'] ?? 'Auto Assigned';
    
    // Remove redundant fields
    unset($booking['technician_name']);
}

json([
    'success' => true,
    'data' => $bookings,
    'total' => count($bookings)
]);
