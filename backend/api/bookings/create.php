<?php
/**
 * POST /api/bookings/create
 * Body: { service, techId?, date, time, address, problemCategory, description?, notes? }
 * Returns: { success, data: Booking }
 * Uses session authentication
 */
require_once __DIR__ . '/../../config/helpers.php';
require_once __DIR__ . '/../../config/database.php';

// CRITICAL: CORS headers MUST come before session_start()
cors();
startSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$auth = requireAuth();
$data = body();

// Only customers can create bookings
if ($auth['role'] !== 'customer') {
    error('Only customers can create bookings', 403);
}

// ── Validate ──────────────────────────────────────────────
$errs = [];
if (empty($data['service']))         $errs['service']         = 'Service is required';
if (empty($data['date']))            $errs['date']            = 'Date is required';
if (empty($data['time']))            $errs['time']            = 'Time is required';
if (empty($data['address']))         $errs['address']         = 'Address is required';
if (empty($data['problemCategory'])) $errs['problemCategory'] = 'Problem type is required';
if ($errs) error('Validation failed', 422, $errs);

$pdo = getDB();

// Resolve service_id from name
$stmt = $pdo->prepare('SELECT id, base_price FROM services WHERE name = ? AND is_active = 1');
$stmt->execute([$data['service']]);
$service = $stmt->fetch();
if (!$service) error('Service not found', 404);

// Resolve technician_id (optional)
$techId = null;
if (!empty($data['techId'])) {
    $stmt = $pdo->prepare('SELECT id FROM technicians WHERE id = ?');
    $stmt->execute([(int) $data['techId']]);
    if ($stmt->fetch()) $techId = (int) $data['techId'];
}

// Generate booking ID: BK + zero-padded count
$count = (int) $pdo->query('SELECT COUNT(*) FROM bookings')->fetchColumn();
$bookingId = 'BK' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

$stmt = $pdo->prepare('
    INSERT INTO bookings
        (id, customer_id, technician_id, service_id, scheduled_date, scheduled_time,
         address, problem_category, description, notes, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
');
$stmt->execute([
    $bookingId,
    $auth['sub'],
    $techId,
    $service['id'],
    $data['date'],
    $data['time'],
    $data['address'],
    $data['problemCategory'],
    $data['description'] ?? '',
    $data['notes']       ?? '',
    $service['base_price'],
    'pending',
]);

// Fetch technician name for response
$techName = 'Auto Assigned';
if ($techId) {
    $stmt = $pdo->prepare('SELECT u.name FROM technicians t JOIN users u ON u.id = t.user_id WHERE t.id = ?');
    $stmt->execute([$techId]);
    $techName = $stmt->fetchColumn() ?: 'Auto Assigned';
}

json([
    'success' => true,
    'data'    => [
        'id'              => $bookingId,
        'service'         => $data['service'],
        'technician'      => $techName,
        'date'            => $data['date'],
        'time'            => $data['time'],
        'status'          => 'pending',
        'amount'          => (int) $service['base_price'],
        'problemCategory' => $data['problemCategory'],
        'description'     => $data['description'] ?? '',
    ],
], 201);
