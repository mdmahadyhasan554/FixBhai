<?php
/**
 * Update Technician Specialization
 * Allows technicians and admins to update specialization
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

cors();
startSession();

// Require authentication
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST' && $method !== 'PATCH') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $userId = $input['userId'] ?? $user['sub'];
    $specialization = $input['specialization'] ?? null;
    $specializationOther = $input['specializationOther'] ?? null;
    
    if (!$specialization) {
        jsonResponse(['success' => false, 'message' => 'Specialization is required'], 400);
    }
    
    // Check if user is updating their own profile or is an admin
    if ($userId != $user['sub'] && $user['role'] !== 'admin') {
        jsonResponse(['success' => false, 'message' => 'Forbidden - You can only update your own specialization'], 403);
    }
    
    // Verify the user is a technician
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$targetUser) {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }
    
    if ($targetUser['role'] !== 'technician') {
        jsonResponse(['success' => false, 'message' => 'Only technicians can have specializations'], 400);
    }
    
    // Update specialization
    $stmt = $db->prepare("
        UPDATE users 
        SET specialization = ?, specialization_other = ? 
        WHERE id = ?
    ");
    
    $stmt->execute([
        $specialization,
        $specialization === 'Other' ? $specializationOther : null,
        $userId
    ]);
    
    if ($stmt->rowCount() > 0 || true) { // Always return success even if no change
        jsonResponse([
            'success' => true,
            'message' => 'Specialization updated successfully'
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Failed to update specialization'], 500);
    }
    
} catch (Exception $e) {
    error_log("Update Specialization Error: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
