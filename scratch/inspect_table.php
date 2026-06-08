<?php
$host = 'acela.proxy.rlwy.net';
$port = '25215';
$db = 'railway';
$user = 'root';
$pass = 'NpEuzAEEjNiopbMEnhIyhixhtivUgaAT';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    
    $stmt = $pdo->query("DESCRIBE jadwal_ujians");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "Field: {$r['Field']} | Type: {$r['Type']} | Null: {$r['Null']} | Key: {$r['Key']} | Default: {$r['Default']}\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
