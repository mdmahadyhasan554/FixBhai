<?php
/**
 * Admin Delete User Avatar
 * DELETE /api/admin/delete-user-avatar
 * 
 * Allows admin to delete avatar for any user
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

header('Content-Type: application/json');
cors();
startSession();
requireAuth(['admin']);

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['user_id'] ?? null;

if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

try {
    $db = getDB();

    // Get user's avatar
    $stmt = $db->prepare("SELECT avatar_url FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $avatarUrl = $stmt->fetchColumn();

    if (!$avatarUrl) {
        jsonResponse(['success' => false, 'message' => 'User has no avatar'], 404);
    }

    // Delete user's avatar directory
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

    // Update database
    $stmt = $db->prepare("UPDATE users SET avatar_url = NULL, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$userId]);

    jsonResponse([
        'success' => true,
        'message' => 'Avatar deleted successfully'
    ]);

} catch (Exception $e) {
    error_log("Admin delete avatar error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
