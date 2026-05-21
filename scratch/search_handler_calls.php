<?php
$file = 'src/AdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'handleRejectBiodata') !== false || strpos($line, 'handleVerifyRegistrasi') !== false || strpos($line, 'handleResetPassword') !== false) {
            echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
        }
    }
}
