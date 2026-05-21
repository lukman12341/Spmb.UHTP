<?php
$file = 'src/AdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'fetch(') !== false || strpos($line, 'axios.') !== false || strpos($line, 'api/') !== false) {
            echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
        }
    }
}
