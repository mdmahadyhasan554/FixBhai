<?php
/**
 * Technician Jobs API
 * GET /api/technicians/jobs
 * 
 * Get all jobs assigned to the logged-in technician
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

cors();
startSession();
requireAuth(['technician']);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $technicianId = $_SESSION['user_id'];
    
    // Get all bookings assigned to this technician
    $query = "
        SELECT 
            b.id,
            b.status,
            b.scheduled_date,
            b.scheduled_time,
            b.address,
            b.problem_category,
            b.description,
            b.notes,
            b.amount,
            b.payment_status,
            b.created_at,
            b.updated_at,
            s.name as service_name,
            s.icon as service_icon,
            u.id as customer_id,
            u.name as customer_name,
            u.email as customer_email,
            u.phone as customer_phone
        FROM bookings b
        INNER JOIN services s ON b.service_id = s.id
        INNER JOIN users u ON b.customer_id = u.id
        WHERE b.technician_id = ?
        ORDER BY 
            CASE b.status
                WHEN 'confirmed' THEN 1
                WHEN 'in_progress' THEN 2
                WHEN 'completed' THEN 3
                WHEN 'cancelled' THEN 4
                ELSE 5
            END,
            b.scheduled_date ASC,
            b.created_at DESC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$technicianId]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate stats
    $stats = [
        'total' => count($jobs),
        'pending' => 0,
        'confirmed' => 0,
        'in_progress' => 0,
        'completed' => 0,
        'cancelled' => 0
    ];
    
    foreach ($jobs as $job) {
        $status = $job['status'];
        if (isset($stats[$status])) {
            $stats[$status]++;
        }
    }
    
    jsonResponse([
        'success' => true,
        'jobs' => $jobs,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    error_log("Technician jobs error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
