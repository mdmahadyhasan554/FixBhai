<?php
/**
 * helpers.php — Shared utilities for all API endpoints.
 *
 * Provides:
 *   cors()          — set CORS headers (allow React dev server)
 *   json($data, $code) — send JSON response and exit
 *   error($msg, $code) — send error JSON and exit
 *   bearerToken()   — extract Bearer token from Authorization header
 *   verifyToken($token) — decode and verify JWT, return payload or null
 *   generateToken($payload) — create a signed JWT
 */

// ── CORS ──────────────────────────────────────────────────
function cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ── JSON response ─────────────────────────────────────────
function json(mixed $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function error(string $message, int $code = 400, array $errors = []): never {
    $body = ['success' => false, 'message' => $message];
    if ($errors) $body['errors'] = $errors;
    json($body, $code);
}

// ── Request body ──────────────────────────────────────────
function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ── JWT (HS256, no external library) ─────────────────────
// Load JWT secret from environment or use default (insecure for production)
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'fixbhai_jwt_secret_change_in_production');
define('JWT_EXPIRY', (int)($_ENV['JWT_EXPIRY'] ?? 60 * 60 * 24 * 7)); // 7 days default

function base64url(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function generateToken(array $payload): string {
    $header    = base64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $claims    = base64url(json_encode($payload));
    $signature = base64url(hash_hmac('sha256', "{$header}.{$claims}", JWT_SECRET, true));
    return "{$header}.{$claims}.{$signature}";
}

function verifyToken(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $claims, $sig] = $parts;
    $expected = base64url(hash_hmac('sha256', "{$header}.{$claims}", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;

    $payload = json_decode(base64_decode(strtr($claims, '-_', '+/')), true);
    if (!$payload || $payload['exp'] < time()) return null;

    return $payload;
}

function bearerToken(): ?string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $header, $m)) return $m[1];
    return null;
}

function requireAuth(): array {
    $token   = bearerToken();
    $payload = $token ? verifyToken($token) : null;
    if (!$payload) error('Unauthorized', 401);
    return $payload;
}

/**
 * Validate a Bangladeshi phone number.
 * Rule: ^01[0-9]{9}$ — starts with 01, exactly 11 digits.
 */
function isValidBDPhone(string $phone): bool {
    $clean = preg_replace('/\s+/', '', $phone);
    return (bool) preg_match('/^01[0-9]{9}$/', $clean);
}
