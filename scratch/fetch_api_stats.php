<?php
$url = 'https://spmbuhtp-production.up.railway.app/api/dashboard/stats';
echo "Fetching $url ...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch) . "\n";
} else {
    echo "HTTP Status Code: $httpCode\n";
    echo "Response: $response\n";
}
curl_close($ch);
