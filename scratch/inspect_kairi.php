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
    
    // Find Kairi Kumar's registration id
    $stmt = $pdo->query("SELECT id, name FROM registrations WHERE name LIKE '%Kairi%' OR name LIKE '%Kumar%'");
    $reg = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$reg) {
        echo "Kairi Kumar not found in registrations!\n";
        exit;
    }
    
    echo "Found registration: ID = {$reg['id']} | Name = {$reg['name']}\n";
    
    // Find in biodatas
    $stmt = $pdo->prepare("SELECT * FROM biodatas WHERE registration_id = ?");
    $stmt->execute([$reg['id']]);
    $biodata = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$biodata) {
        echo "No biodata found for registration ID {$reg['id']}!\n";
        exit;
    }
    
    echo "Biodata columns:\n";
    foreach ($biodata as $key => $val) {
        echo "$key: " . ($val === null ? 'NULL' : $val) . "\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
