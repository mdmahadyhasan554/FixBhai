<?php
/**
 * POST /api/auth/register
 * Body: { name, email, phone, password }
 * Returns: { success, user, token }
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$data = body();

// ── Validate ──────────────────────────────────────────────
$errs = [];
if (empty(trim($data['name'] ?? '')))     $errs['name']     = 'Name is required';
if (empty(trim($data['email'] ?? '')))    $errs['email']    = 'Email is required';
if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) $errs['email'] = 'Invalid email';
if (empty(trim($data['phone'] ?? '')))    $errs['phone']    = 'Phone is required';
if (strlen($data['password'] ?? '') < 6) $errs['password'] = 'Password must be at least 6 characters';
if ($errs) error('Validation failed', 422, $errs);

$pdo = getDB();

// ── Check duplicate email ─────────────────────────────────
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([strtolower(trim($data['email']))]);
if ($stmt->fetch()) error('Email already registered', 409);

// ── Insert user ───────────────────────────────────────────
$hash = password_hash($data['password'], PASSWORD_BCRYPT);
$stmt = $pdo->prepare(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([
    trim($data['name']),
    strtolower(trim($data['email'])),
    trim($data['phone']),
    $hash,
    'customer',
]);
$userId = (int) $pdo->lastInsertId();

$user  = ['id' => $userId, 'name' => trim($data['name']), 'email' => strtolower(trim($data['email'])), 'role' => 'customer'];
$token = generateToken(['sub' => $userId, 'role' => 'customer', 'email' => $user['email']]);

json(['success' => true, 'user' => $user, 'token' => $token], 201);
