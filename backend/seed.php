<?php
/**
 * seed.php — Generate correct bcrypt hashes for demo users.
 * Visit: http://localhost/backend/seed.php
 * Then copy the UPDATE statements into phpMyAdmin and run them.
 * Delete this file after use.
 */
$users = [
    ['email' => 'admin@fixbhai.com',  'password' => 'Admin@123'],
    ['email' => 'rahim@gmail.com',    'password' => 'Demo@1234'],
    ['email' => 'karim@fixbhai.com',  'password' => 'Tech@1234'],
];

header('Content-Type: text/plain');
echo "-- Run these in phpMyAdmin (fixbhai database):\n\n";

foreach ($users as $u) {
    $hash = password_hash($u['password'], PASSWORD_BCRYPT, ['cost' => 10]);
    echo "UPDATE users SET password_hash = '{$hash}' WHERE email = '{$u['email']}';\n\n";
}

echo "-- Done. Delete backend/seed.php after running.\n";
