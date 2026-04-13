<?php
/**
 * Delete Avatar
 * DELETE /api/users/delete-avatar
 * 
 * Removes profile picture and cleans up user's avatar directory
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/helpers.php';

// CRITICAL: CORS headers MUST come before session_start()
header('Content-Type: application/json');
cors();
startSession();

// Only DELETE allowed
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Verify authentication
requireAuth();

try {
    $db = getDB();
    $userId = $_SESSION['user_id'];

    // Get current avatar
    $stmt = $db->prepare("SELECT avatar_url FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $avatarUrl = $stmt->fetchColumn();

    // Delete user's avatar directory and all files
    if ($avatarUrl) {
        $userAvatarDir = __DIR__ . '/../../assets/avatars/' . $userId . '/';
        if (is_dir($userAvatarDir)) {
            $files = glob($userAvatarDir . '*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }
            rmdir($userAvatarDir);
        }
        
        // Also check old uploads directory for backward compatibility
        $oldDir = __DIR__ . '/../../uploads/avatars/';
        if (is_dir($oldDir)) {
            $oldFiles = glob($oldDir . 'avatar_' . $userId . '_*');
            foreach ($oldFiles as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }
        }
    }

    // Update database
    $stmt = $db->prepare("UPDATE users SET avatar_url = NULL, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$userId]);

    jsonResponse([
        'success' => true,
        'message' => 'Avatar deleted successfully'
    ]);

} catch (Exception $e) {
    error_log("Avatar delete error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
