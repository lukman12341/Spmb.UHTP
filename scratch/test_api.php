<?php
$url = 'https://spmbuhtp-production.up.railway.app/api/soal';
echo "Fetching $url ...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 10 seconds timeout
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch) . "\n";
} else {
    echo "HTTP Status Code: $httpCode\n";
    echo "Response length: " . strlen($response) . " bytes\n";
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        echo "Total questions: " . count($data) . "\n";
        if (count($data) > 0) {
            echo "First question: " . strip_tags($data[0]['pertanyaan']) . "\n";
        }
    } else {
        echo "Response snippet: " . substr($response, 0, 200) . "\n";
    }
}
curl_close($ch);
