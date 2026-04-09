<?php
/**
 * Upload Avatar
 * POST /api/users/upload-avatar
 * 
 * Handles profile picture upload for authenticated users
 * Supports: JPG, JPEG, PNG, GIF (max 5MB)
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/helpers.php';

header('Content-Type: application/json');
cors();

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Check if file was uploaded
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['avatar'];

// Validate file size (5MB max)
$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit']);
    exit;
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed']);
    exit;
}

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../../uploads/avatars/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $user['id'] . '_' . time() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Delete old avatar if exists
$db = getDBConnection();
$stmt = $db->prepare("SELECT avatar_url FROM users WHERE id = ?");
$stmt->execute([$user['id']]);
$oldAvatar = $stmt->fetchColumn();

if ($oldAvatar && strpos($oldAvatar, '/uploads/avatars/') !== false) {
    $oldFilename = basename($oldAvatar);
    $oldFilepath = $uploadDir . $oldFilename;
    if (file_exists($oldFilepath)) {
        unlink($oldFilepath);
    }
}

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit;
}

// Update database with new avatar URL
$avatarUrl = '/reactJS/FixBhai/backend/uploads/avatars/' . $filename;
$stmt = $db->prepare("UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?");
$stmt->execute([$avatarUrl, $user['id']]);

echo json_encode([
    'success' => true,
    'message' => 'Avatar uploaded successfully',
    'avatar_url' => 'http://localhost' . $avatarUrl
]);
