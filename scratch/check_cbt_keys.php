<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'key={') !== false) {
            echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
        }
    }
} else {
    echo "CbtAdminDashboard.tsx does not exist\n";
}
