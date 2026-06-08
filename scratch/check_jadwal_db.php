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
    
    $stmt = $pdo->query("SELECT * FROM jadwal_ujians");
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$r['id']} | Gelombang: {$r['gelombang']} | Ujian: {$r['tanggal_ujian']} | Jam: {$r['jam_mulai']}-{$r['jam_berakhir']} | Reg: {$r['tanggal_registrasi_mulai']} s/d {$r['tanggal_registrasi_akhir']}\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
