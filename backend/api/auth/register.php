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

if (empty(trim($data['name'] ?? '')))
    $errs['name'] = 'Name is required';

if (empty(trim($data['email'] ?? '')) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL))
    $errs['email'] = 'Valid email is required';

// Bangladesh phone: starts with 01, exactly 11 digits — ^01[0-9]{9}$
$phone = preg_replace('/\s+/', '', $data['phone'] ?? '');
if (!preg_match('/^01[0-9]{9}$/', $phone))
    $errs['phone'] = 'Enter a valid BD number (01XXXXXXXXX, 11 digits)';

if (strlen($data['password'] ?? '') < 6)
    $errs['password'] = 'Password must be at least 6 characters';

if ($errs) error('Validation failed', 422, $errs);

$pdo = getDB();

// ── Check duplicate email ─────────────────────────────────
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([strtolower(trim($data['email']))]);
if ($stmt->fetch()) error('Email already registered', 409);

// ── Check duplicate phone ─────────────────────────────────
$stmt = $pdo->prepare('SELECT id FROM users WHERE phone = ?');
$stmt->execute([$phone]);
if ($stmt->fetch()) error('Phone number already registered', 409);

// ── Insert user ───────────────────────────────────────────
$hash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 10]);
$stmt = $pdo->prepare(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([
    trim($data['name']),
    strtolower(trim($data['email'])),
    $phone,
    $hash,
    'customer',
]);
$userId = (int) $pdo->lastInsertId();

$user  = [
    'id'    => $userId,
    'name'  => trim($data['name']),
    'email' => strtolower(trim($data['email'])),
    'phone' => $phone,
    'role'  => 'customer',
];
$token = generateToken(['sub' => $userId, 'role' => 'customer', 'email' => $user['email']]);

json(['success' => true, 'user' => $user, 'token' => $token], 201);
