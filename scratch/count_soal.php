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
    
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM soals");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total questions in 'soals' table: " . $row['cnt'] . "\n";
    
    $stmt = $pdo->query("SELECT id, type_soal, soal_untuk, SUBSTRING(pertanyaan, 1, 50) as pert FROM soals LIMIT 5");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$r['id']} | Type: {$r['type_soal']} | For: {$r['soal_untuk']} | Text: " . strip_tags($r['pert']) . "\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
