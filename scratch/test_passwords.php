<?php
$host = 'acela.proxy.rlwy.net';
$port = '25215';
$db = 'railway';
$user = 'root';

// Let's generate candidates based on potential transcription typos
$candidates = [
    'NpFuzAFFjNiophMFnhTyhixtivUgaAT',
    'NpEuzAEEjNiopbMEnhIyhixhtivUgaAT',
    'NpFuzAFFjNiophMFnhIyhixtivUgaAT',
    'NpFuzAFFjNiophMFNhTyhixtivUgaAT',
    'NpFuzAFFjNiophMFnhTyhixhtivUgaAT',
    'NpFuzAFFjNiopbMFnhTyhixtivUgaAT',
    'NpFuzAFFjNiophMFnhTyhixtivUgaAT ',
    'NpFuzAFFjNiophMFnhTyhixtivUgaAT',
    'NpFuzAFFjNiophMFnhTyhixtivUgaAT',
];

// Deduplicate candidates
$candidates = array_unique($candidates);

foreach ($candidates as $pass) {
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_TIMEOUT => 2, // fast timeout for wrong password
        ]);
        echo "SUCCESS PASSWORD: $pass\n";
        exit(0);
    } catch (Exception $e) {
        echo "FAILED: $pass -> " . $e->getMessage() . "\n";
    }
}
echo "ALL FAILED\n";
