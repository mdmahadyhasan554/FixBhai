<?php
/**
 * Admin User Status Update API
 * Update user active status (admin only)
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
    
    $userId = $input['userId'] ?? null;
    $isActive = isset($input['isActive']) ? (bool)$input['isActive'] : null;
    
    if (!$userId || $isActive === null) {
        jsonResponse(['success' => false, 'message' => 'Missing userId or isActive'], 400);
    }
    
    // Prevent admin from deactivating themselves
    if ($userId == $_SESSION['user_id'] && !$isActive) {
        jsonResponse(['success' => false, 'message' => 'You cannot deactivate your own account'], 403);
    }
    
    // Update user status
    $stmt = $db->prepare("UPDATE users SET is_active = ? WHERE id = ?");
    $stmt->execute([$isActive ? 1 : 0, $userId]);
    
    if ($stmt->rowCount() > 0) {
        jsonResponse([
            'success' => true,
            'message' => 'User status updated successfully'
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'User not found or status unchanged'], 404);
    }
    
} catch (Exception $e) {
    error_log("User Status Update Error: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ], 500);
}
