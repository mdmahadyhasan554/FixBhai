<?php
/**
 * Admin User Role Update API
 * Update user role (admin only)
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
    if ($method !== 'POST' && $method !== 'PATCH') {
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }
    
    $db = getDB();
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Debug logging
    error_log("User Role Update - Input: " . json_encode($input));
    error_log("User Role Update - Session User ID: " . $_SESSION['user_id']);
    
    $userId = $input['userId'] ?? null;
    $role = $input['role'] ?? null;
    
    if (!$userId || !$role) {
        jsonResponse(['success' => false, 'message' => 'Missing userId or role'], 400);
    }
    
    // Validate role
    $validRoles = ['customer', 'technician', 'admin'];
    if (!in_array($role, $validRoles)) {
        jsonResponse(['success' => false, 'message' => 'Invalid role. Must be: customer, technician, or admin'], 400);
    }
    
    // Prevent admin from changing their own role
    if ($userId == $_SESSION['user_id']) {
        jsonResponse(['success' => false, 'message' => 'You cannot change your own role'], 403);
    }
    
    // Update user role
    $stmt = $db->prepare("UPDATE users SET role = ? WHERE id = ?");
    $result = $stmt->execute([$role, $userId]);
    
    error_log("User Role Update - Execute result: " . ($result ? 'true' : 'false'));
    error_log("User Role Update - Rows affected: " . $stmt->rowCount());
    
    if ($stmt->rowCount() > 0) {
        jsonResponse([
            'success' => true,
            'message' => 'User role updated successfully'
        ]);
    } else {
        // Check if user exists
        $checkStmt = $db->prepare("SELECT id, role FROM users WHERE id = ?");
        $checkStmt->execute([$userId]);
        $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            jsonResponse(['success' => false, 'message' => 'User not found'], 404);
        } else {
            jsonResponse(['success' => false, 'message' => 'Role unchanged (already set to ' . $user['role'] . ')'], 200);
        }
    }
    
} catch (Exception $e) {
    error_log("User Role Update Error: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
