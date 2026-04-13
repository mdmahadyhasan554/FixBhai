<?php
/**
 * Admin Update User
 * POST /api/admin/update-user
 * 
 * Allows admin to update any user's profile information
 * Admin can edit: name, email, phone, role, status, specialization
 */

require_once '../../config/database.php';
require_once '../../config/helpers.php';

cors();
startSession();
requireAuth(['admin']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$userId = $input['user_id'] ?? null;
$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$phone = $input['phone'] ?? null;
$role = $input['role'] ?? null;
$isActive = $input['is_active'] ?? null;
$specialization = $input['specialization'] ?? null;
$specializationOther = $input['specialization_other'] ?? null;

if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

try {
    $db = getDB();
    
    // Build dynamic update query
    $updates = [];
    $params = [];
    
    if ($name !== null) {
        $updates[] = "name = ?";
        $params[] = $name;
    }
    
    if ($email !== null) {
        // Check if email is already taken by another user
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        if ($stmt->fetch()) {
            jsonResponse(['success' => false, 'message' => 'Email already in use'], 400);
        }
        $updates[] = "email = ?";
        $params[] = $email;
    }
    
    if ($phone !== null) {
        $updates[] = "phone = ?";
        $params[] = $phone;
    }
    
    if ($role !== null) {
        $validRoles = ['customer', 'technician', 'admin'];
        if (!in_array($role, $validRoles)) {
            jsonResponse(['success' => false, 'message' => 'Invalid role'], 400);
        }
        $updates[] = "role = ?";
        $params[] = $role;
    }
    
    if ($isActive !== null) {
        $updates[] = "is_active = ?";
        $params[] = $isActive ? 1 : 0;
    }
    
    if ($specialization !== null) {
        $updates[] = "specialization = ?";
        $params[] = $specialization;
    }
    
    if ($specializationOther !== null) {
        $updates[] = "specialization_other = ?";
        $params[] = $specializationOther;
    }
    
    if (empty($updates)) {
        jsonResponse(['success' => false, 'message' => 'No fields to update'], 400);
    }
    
    // Add updated_at
    $updates[] = "updated_at = NOW()";
    $params[] = $userId;
    
    // Execute update
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'User not found or no changes made'], 404);
    }
    
    // Get updated user
    $stmt = $db->prepare("SELECT id, name, email, phone, role, is_active, specialization, specialization_other, avatar_url, created_at, updated_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    jsonResponse([
        'success' => true,
        'message' => 'User updated successfully',
        'user' => $user
    ]);
    
} catch (Exception $e) {
    error_log("Admin update user error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
