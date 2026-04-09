<?php
/**
 * Update Profile
 * PUT /api/users/update-profile
 * 
 * Updates user profile information
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/helpers.php';

header('Content-Type: application/json');
cors();

// Only PUT allowed
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

$db = getDBConnection();
$updates = [];
$params = [];

// Allowed fields to update
if (isset($data['name']) && !empty(trim($data['name']))) {
    $updates[] = "name = ?";
    $params[] = trim($data['name']);
}

if (isset($data['phone']) && !empty(trim($data['phone']))) {
    $updates[] = "phone = ?";
    $params[] = trim($data['phone']);
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
    exit;
}

// Add updated_at
$updates[] = "updated_at = NOW()";
$params[] = $user['id'];

// Build and execute query
$sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->execute($params);

// Fetch updated user data
$stmt = $db->prepare("SELECT id, name, email, phone, role, avatar_url, is_active FROM users WHERE id = ?");
$stmt->execute([$user['id']]);
$updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'message' => 'Profile updated successfully',
    'user' => $updatedUser
]);
