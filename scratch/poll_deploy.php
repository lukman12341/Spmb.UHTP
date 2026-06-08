<?php
$url = 'https://spmbuhtp-production.up.railway.app/api/debug-stats';
for ($i = 1; $i <= 12; $i++) {
    echo "Attempt $i: Fetching $url ...\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n";
    if ($httpCode === 200) {
        echo "SUCCESS! Response: $response\n";
        break;
    }
    sleep(10);
}
