<?php
/**
 * GET /api/admin/users
 * Returns: { success, data: User[] }
 * Admin only - Get all users
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

// Get all users with their details
$stmt = $pdo->prepare('
    SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.avatar_url,
        u.is_active,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT b.id) as total_bookings,
        COALESCE(SUM(CASE WHEN b.status = "completed" THEN b.amount ELSE 0 END), 0) as total_spent
    FROM users u
    LEFT JOIN bookings b ON b.customer_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
');
$stmt->execute();
$users = $stmt->fetchAll();

// Format the data
foreach ($users as &$user) {
    $user['total_bookings'] = (int) $user['total_bookings'];
    $user['total_spent'] = (float) $user['total_spent'];
    $user['is_active'] = (bool) $user['is_active'];
}

json([
    'success' => true,
    'data' => $users,
    'total' => count($users)
]);
