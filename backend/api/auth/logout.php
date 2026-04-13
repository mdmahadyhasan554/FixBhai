<?php
/**
 * POST /api/auth/logout
 * Destroys session
 */
require_once __DIR__ . '/../../config/helpers.php';

// CRITICAL: CORS headers MUST come before session_start()
cors();
startSession();

clearUserSession();

json(['success' => true, 'message' => 'Logged out successfully']);
