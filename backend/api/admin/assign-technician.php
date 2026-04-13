<?php
/**
 * Admin Assign Technician to Booking
 * POST /api/admin/assign-technician
 * 
 * Allows admin to assign a technician to a booking
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

$bookingId = $input['booking_id'] ?? null;
$technicianId = $input['technician_id'] ?? null;

if (!$bookingId) {
    jsonResponse(['success' => false, 'message' => 'Booking ID is required'], 400);
}

try {
    $db = getDB();
    
    // If technician_id is null, unassign the technician
    if ($technicianId === null) {
        $stmt = $db->prepare("UPDATE bookings SET technician_id = NULL, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$bookingId]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Technician unassigned successfully'
        ]);
    }
    
    // Verify technician exists and is active
    $stmt = $db->prepare("SELECT id, name FROM users WHERE id = ? AND role = 'technician' AND is_active = 1");
    $stmt->execute([$technicianId]);
    $technician = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$technician) {
        jsonResponse(['success' => false, 'message' => 'Invalid or inactive technician'], 400);
    }
    
    // Verify booking exists
    $stmt = $db->prepare("SELECT id, status FROM bookings WHERE id = ?");
    $stmt->execute([$bookingId]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        jsonResponse(['success' => false, 'message' => 'Booking not found'], 404);
    }
    
    // Assign technician to booking
    $stmt = $db->prepare("UPDATE bookings SET technician_id = ?, status = 'confirmed', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$technicianId, $bookingId]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Technician assigned successfully',
        'technician' => $technician
    ]);
    
} catch (Exception $e) {
    error_log("Assign technician error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
