<?php
$file = 'src/AdminDashboard.tsx';
$lines = file($file);
foreach ($lines as $idx => $line) {
    if (strpos($line, 'key={') !== false) {
        echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
    }
}
