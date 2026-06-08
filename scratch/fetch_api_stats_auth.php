<?php
$baseUrl = 'https://spmbuhtp-production.up.railway.app';

// 1. Login
$loginUrl = $baseUrl . '/api/login';
echo "Logging in to $loginUrl ...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $loginUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admincbt@uhtp.ac.id',
    'password' => 'admincbt123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'Login error: ' . curl_error($ch) . "\n";
    exit(1);
}

echo "Login Response ($httpCode): $response\n";
$data = json_decode($response, true);
$token = $data['token'] ?? null;

if (!$token) {
    echo "No token received!\n";
    exit(1);
}

// 2. Fetch stats
$statsUrl = $baseUrl . '/api/dashboard/stats';
echo "Fetching stats from $statsUrl ...\n";
curl_setopt($ch, CURLOPT_URL, $statsUrl);
curl_setopt($ch, CURLOPT_POST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Admin-Token: ' . $token,
    'Accept: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo 'Stats error: ' . curl_error($ch) . "\n";
} else {
    echo "Stats Response ($httpCode): $response\n";
}

curl_close($ch);
