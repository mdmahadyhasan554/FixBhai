<?php
/**
 * Admin Technicians API
 * Get all technicians with their stats
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

// CORS headers MUST come first
cors();

// Start session after CORS
startSession();

// Require admin authentication
requireAuth(['admin']);

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'GET') {
        // Get all technicians with stats
        $query = "
            SELECT 
                u.id,
                u.name,
                u.email,
                u.phone,
                u.role,
                u.is_active,
                u.specialization,
                u.specialization_other,
                u.created_at,
                u.avatar_url,
                COUNT(DISTINCT b.id) as total_jobs,
                COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_jobs
            FROM users u
            LEFT JOIN bookings b ON u.id = b.technician_id
            WHERE u.role = 'technician'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        ";
        
        $stmt = $db->query($query);
        $technicians = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate completion rate for each technician
        foreach ($technicians as &$tech) {
            $tech['total_jobs'] = (int)$tech['total_jobs'];
            $tech['completed_jobs'] = (int)$tech['completed_jobs'];
            $tech['avg_rating'] = 0; // Rating system not implemented yet
            $tech['completion_rate'] = $tech['total_jobs'] > 0 
                ? round(($tech['completed_jobs'] / $tech['total_jobs']) * 100, 1) 
                : 0;
            $tech['is_active'] = (bool)$tech['is_active'];
            
            // Format specialization display
            if ($tech['specialization'] === 'Other' && $tech['specialization_other']) {
                $tech['specialization_display'] = $tech['specialization_other'];
            } else {
                $tech['specialization_display'] = $tech['specialization'] ?: 'General';
            }
        }
        
        jsonResponse([
            'success' => true,
            'data' => $technicians,
            'total' => count($technicians)
        ]);
        
    } elseif ($method === 'POST') {
        // Update technician status
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['action']) || $input['action'] !== 'update_status') {
            jsonResponse(['success' => false, 'message' => 'Invalid action'], 400);
        }
        
        $technicianId = $input['technician_id'] ?? null;
        $status = $input['status'] ?? null;
        
        if (!$technicianId || !$status) {
            jsonResponse(['success' => false, 'message' => 'Missing required fields'], 400);
        }
        
        // Validate status
        $validStatuses = ['approved', 'pending', 'suspended'];
        if (!in_array($status, $validStatuses)) {
            jsonResponse(['success' => false, 'message' => 'Invalid status'], 400);
        }
        
        // Update technician status (using is_active field)
        $isActive = $status === 'approved' ? 1 : 0;
        
        $stmt = $db->prepare("UPDATE users SET is_active = ? WHERE id = ? AND role = 'technician'");
        $stmt->execute([$isActive, $technicianId]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse([
                'success' => true,
                'message' => 'Technician status updated successfully'
            ]);
        } else {
            jsonResponse(['success' => false, 'message' => 'Technician not found'], 404);
        }
        
    } else {
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    error_log("Admin Technicians API Error: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
