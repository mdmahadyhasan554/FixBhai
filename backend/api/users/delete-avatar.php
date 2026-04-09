<?php
/**
 * Delete Avatar
 * DELETE /api/users/delete-avatar
 * 
 * Removes profile picture for authenticated user
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/helpers.php';

header('Content-Type: application/json');
cors();

// Only DELETE allowed
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Verify authentication
$user = authenticate();
if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$db = getDBConnection();

// Get current avatar
$stmt = $db->prepare("SELECT avatar_url FROM users WHERE id = ?");
$stmt->execute([$user['id']]);
$avatarUrl = $stmt->fetchColumn();

// Delete file if it's a local upload
if ($avatarUrl && strpos($avatarUrl, '/uploads/avatars/') !== false) {
    $filename = basename($avatarUrl);
    $filepath = __DIR__ . '/../../uploads/avatars/' . $filename;
    if (file_exists($filepath)) {
        unlink($filepath);
    }
}

// Update database
$stmt = $db->prepare("UPDATE users SET avatar_url = NULL, updated_at = NOW() WHERE id = ?");
$stmt->execute([$user['id']]);

echo json_encode([
    'success' => true,
    'message' => 'Avatar deleted successfully'
]);
