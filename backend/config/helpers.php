<?php
/**
 * helpers.php — Shared utilities for all API endpoints.
 *
 * Provides:
 *   cors()          — set CORS headers (allow React dev server)
 *   json($data, $code) — send JSON response and exit
 *   error($msg, $code) — send error JSON and exit
 *   requireAuth()   — check if user is logged in via session
 *   startSession()  — start session with proper settings
 */

// ── CORS ──────────────────────────────────────────────────
function cors(): void {
    // CRITICAL: Set headers BEFORE session_start()
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // 24 hours

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

// ── Session Configuration ─────────────────────────────────
function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        // Configure session for cross-origin requests
        // Note: SameSite=None requires Secure=true, but we're on HTTP in dev
        // So we use Lax for development
        ini_set('session.cookie_samesite', 'Lax'); // Changed from None to Lax for HTTP
        ini_set('session.cookie_secure', '0'); // Set to '1' in production with HTTPS
        ini_set('session.cookie_httponly', '1');
        ini_set('session.use_strict_mode', '1');
        ini_set('session.cookie_lifetime', '604800'); // 7 days
        ini_set('session.cookie_path', '/');
        ini_set('session.cookie_domain', ''); // Empty for localhost
        
        session_name('FIXBHAI_SESSION');
        session_start();
    }
}

// ── JSON response ─────────────────────────────────────────
function json(mixed $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Alias for json() - used in many API files
function jsonResponse(mixed $data, int $code = 200): never {
    json($data, $code);
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

// ── Authentication (Session-based) ───────────────────────
function requireAuth(array $allowedRoles = []): array {
    startSession();
    
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
        error('Unauthorized - Please login', 401);
    }
    
    // Check if user has required role
    if (!empty($allowedRoles) && !in_array($_SESSION['user_role'], $allowedRoles)) {
        error('Forbidden - Insufficient permissions', 403);
    }
    
    return [
        'sub' => $_SESSION['user_id'],
        'role' => $_SESSION['user_role'],
        'email' => $_SESSION['user_email'] ?? '',
        'name' => $_SESSION['user_name'] ?? ''
    ];
}

function isLoggedIn(): bool {
    startSession();
    return isset($_SESSION['user_id']);
}

function setUserSession(array $user): void {
    startSession();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['name'];
}

function clearUserSession(): void {
    startSession();
    $_SESSION = [];
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    session_destroy();
}

/**
 * Validate a Bangladeshi phone number.
 * Rule: ^01[0-9]{9}$ — starts with 01, exactly 11 digits.
 */
function isValidBDPhone(string $phone): bool {
    $clean = preg_replace('/\s+/', '', $phone);
    return (bool) preg_match('/^01[0-9]{9}$/', $clean);
}

// ── Legacy JWT functions (kept for backward compatibility) ──
// Load JWT secret from environment
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
    // Try multiple ways to get the Authorization header
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['HTTP_AUTHORIZATION'];
        if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
            return $m[1];
        }
    }
    
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
            return $m[1];
        }
    }
    
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $header = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
                return $m[1];
            }
        }
        if (isset($headers['authorization'])) {
            $header = $headers['authorization'];
            if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
                return $m[1];
            }
        }
    }
    
    return null;
}
