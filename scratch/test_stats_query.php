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
    
    // Count all registrations
    $stmt = $pdo->query("SELECT COUNT(*) FROM registrations");
    $total = $stmt->fetchColumn();
    echo "Total registrations: $total\n";
    
    // Count Jalur A like Laravel does now
    $sql = "SELECT COUNT(*) FROM registrations 
            WHERE program_studi NOT LIKE '%Ners%'
              AND program_studi NOT LIKE '%Profesi Bidan%'
              AND program_studi NOT LIKE '%Pasca%'
              AND program_studi NOT LIKE '%S2%'
              AND program_studi NOT LIKE '%Magister%'
              AND program_studi NOT LIKE '%STMIK%'
              AND program_studi NOT LIKE '%Beasiswa%'
              AND program_studi NOT LIKE '%Jalur B%'";
              
    $stmt = $pdo->query($sql);
    $jalurA = $stmt->fetchColumn();
    echo "Jalur A Count: $jalurA\n";
    
    // List all records with their program_studi
    $stmt = $pdo->query("SELECT id, name, program_studi FROM registrations");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$r['id']} | Name: {$r['name']} | Program: {$r['program_studi']}\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
