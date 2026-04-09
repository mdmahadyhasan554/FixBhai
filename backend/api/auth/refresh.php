<?php
/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Returns: { success, token }
 * 
 * Refreshes an expired access token using a refresh token.
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$data = body();

if (empty($data['refreshToken'])) error('Refresh token is required', 422);

$pdo = getDB();

// Verify refresh token exists and is not expired
$stmt = $pdo->prepare('
    SELECT user_id, expires_at 
    FROM refresh_tokens 
    WHERE token = ? AND revoked = 0
');
$stmt->execute([$data['refreshToken']]);
$refreshToken = $stmt->fetch();

if (!$refreshToken) error('Invalid refresh token', 401);

if (strtotime($refreshToken['expires_at']) < time()) {
    error('Refresh token expired', 401);
}

// Fetch user
$stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = ? AND is_active = 1');
$stmt->execute([$refreshToken['user_id']]);
$user = $stmt->fetch();

if (!$user) error('User not found', 401);

// Generate new access token
$payload = [
    'sub'   => $user['id'],
    'role'  => $user['role'],
    'email' => $user['email'],
];
$token = generateToken($payload);

json([
    'success' => true,
    'token'   => $token,
    'user'    => $user,
]);
