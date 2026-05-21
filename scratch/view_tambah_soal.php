<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    $found = false;
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'const renderTambahSoal =') !== false || strpos($line, 'renderTambahSoal = ()') !== false) {
            $found = true;
            echo "Found renderTambahSoal at line " . ($idx + 1) . ":\n";
            for ($i = $idx; $i < min(count($lines), $idx + 180); $i++) {
                echo ($i + 1) . ": " . $lines[$i];
            }
            break;
        }
    }
}
