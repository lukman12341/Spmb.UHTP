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
    
    $stmt = $pdo->query("SELECT program_studi, COUNT(*) as cnt FROM registrations GROUP BY program_studi");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "Program Studi: {$r['program_studi']} | Count: {$r['cnt']}\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
