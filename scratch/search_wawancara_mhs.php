<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'fetch(') !== false && (strpos($line, 'kesehatan') !== false || strpos($line, 'wawancara') !== false)) {
            echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
        }
    }
}
