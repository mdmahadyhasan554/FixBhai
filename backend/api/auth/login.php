<?php
/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, user, token }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$data = body();

if (empty($data['email']) || empty($data['password']))
    error('Email and password are required', 422);

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1');
$stmt->execute([strtolower(trim($data['email']))]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password_hash']))
    error('Invalid email or password', 401);

$payload = ['sub' => $user['id'], 'role' => $user['role'], 'email' => $user['email']];
$token   = generateToken($payload);

unset($user['password_hash']);

json(['success' => true, 'user' => $user, 'token' => $token]);
