<?php
$host = 'acela.proxy.rlwy.net';
$port = '25215';
$db = 'railway';
$user = 'root';
$pass = 'NpEuzAEEjNiopbMEnhIyhixhtivUgaAT';
$sqlFile = 'C:\\Users\\LENOVO\\Downloads\\soals.sql';

try {
    echo "Connecting to Railway MySQL...\n";
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connected successfully!\n";

    echo "Reading SQL file...\n";
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found at: $sqlFile");
    }
    $sql = file_get_contents($sqlFile);
    
    echo "Executing SQL statements...\n";
    $pdo->exec($sql);
    echo "SQL import completed successfully!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
