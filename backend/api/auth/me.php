<?php
/**
 * GET /api/auth/me
 * Returns: { success, user }
 * Uses session authentication
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

// CRITICAL: CORS headers MUST come before session_start()
cors();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$auth = requireAuth();

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, name, email, phone, role, avatar_url, created_at FROM users WHERE id = ?');
$stmt->execute([$auth['sub']]);
$user = $stmt->fetch();

if (!$user) error('User not found', 404);

json(['success' => true, 'user' => $user]);
