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
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "Connected successfully!\n";

    echo "Truncating 'soals' table to prevent duplicate key errors...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE soals;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "Reading and parsing SQL file...\n";
    $sql = file_get_contents($sqlFile);
    
    // Remove C-style block comments (including MySQL conditional comments /*! ... */)
    $sql = preg_replace('/\/\\*[\s\S]*?\\*\/;?/i', '', $sql);

    // Remove SQL line comments
    $sql = preg_replace('/^[ \t]*--.*$/m', '', $sql);
    $sql = preg_replace('/^[ \t]*#.*$/m', '', $sql);

    // Remove phpMyAdmin/MySQL transactions and settings
    $sql = preg_replace('/SET\s+[A-Z_]+\s*=\s*[^;]+;/i', '', $sql);
    $sql = str_ireplace('START TRANSACTION;', '', $sql);
    $sql = str_ireplace('COMMIT;', '', $sql);

    // Remove CREATE TABLE block
    $sql = preg_replace('/CREATE TABLE\s+`soals`[\s\S]+?ENGINE=[^;]+;/i', '', $sql);

    // Remove ALTER TABLE blocks
    $sql = preg_replace('/ALTER TABLE\s+`soals`[\s\S]+?;/i', '', $sql);

    $sql = trim($sql);

    echo "Executing cleaned SQL statements...\n";
    if (!empty($sql)) {
        $pdo->exec($sql);
        echo "SQL import completed successfully!\n";
    } else {
        echo "ERROR: Cleaned SQL is empty!\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
