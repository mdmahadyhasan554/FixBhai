<?php
/**
 * Admin Upload User Avatar
 * POST /api/admin/upload-user-avatar
 * 
 * Allows admin to upload/change avatar for any user
 * Includes image compression and organized storage
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

header('Content-Type: application/json');
cors();
startSession();
requireAuth(['admin']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$userId = $_POST['user_id'] ?? null;

if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

// Check if file was uploaded
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'No file uploaded or upload error'], 400);
}

$file = $_FILES['avatar'];

// Validate file size (5MB max)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    jsonResponse(['success' => false, 'message' => 'File size exceeds 5MB limit'], 400);
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    jsonResponse(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed'], 400);
}

/**
 * Compress and resize image
 */
function compressImage($sourcePath, $mimeType, $targetPath, $quality = 85, $maxWidth = 500, $maxHeight = 500) {
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $source = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $source = imagecreatefromgif($sourcePath);
            break;
        default:
            return false;
    }

    if (!$source) return false;

    $width = imagesx($source);
    $height = imagesy($source);
    $ratio = min($maxWidth / $width, $maxHeight / $height);
    $newWidth = round($width * $ratio);
    $newHeight = round($height * $ratio);

    $destination = imagecreatetruecolor($newWidth, $newHeight);
    imagealphablending($destination, false);
    imagesavealpha($destination, true);
    imagecopyresampled($destination, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    $result = imagejpeg($destination, $targetPath, $quality);

    imagedestroy($source);
    imagedestroy($destination);

    return $result;
}

try {
    $db = getDB();
    
    // Verify user exists
    $stmt = $db->prepare("SELECT id, avatar_url FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }

    // Create user-specific directory
    $uploadDir = __DIR__ . '/../../assets/avatars/' . $userId . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate filename
    $filename = 'avatar_' . time() . '.jpg';
    $filepath = $uploadDir . $filename;

    // Delete old avatar files
    if ($user['avatar_url']) {
        if (preg_match('/\/assets\/avatars\/(\d+)\//', $user['avatar_url'], $matches)) {
            $oldDir = __DIR__ . '/../../assets/avatars/' . $matches[1] . '/';
            if (is_dir($oldDir)) {
                $files = glob($oldDir . '*');
                foreach ($files as $oldFile) {
                    if (is_file($oldFile)) {
                        unlink($oldFile);
                    }
                }
            }
        }
    }

    // Compress and save image
    if (!compressImage($file['tmp_name'], $mimeType, $filepath, 85, 500, 500)) {
        jsonResponse(['success' => false, 'message' => 'Failed to process image'], 500);
    }

    // Update database
    $avatarUrl = '/reactJS/FixBhai/backend/assets/avatars/' . $userId . '/' . $filename;
    $stmt = $db->prepare("UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$avatarUrl, $userId]);

    jsonResponse([
        'success' => true,
        'message' => 'Avatar uploaded successfully',
        'avatar_url' => 'http://localhost' . $avatarUrl
    ]);

} catch (Exception $e) {
    error_log("Admin avatar upload error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
