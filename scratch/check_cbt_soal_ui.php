<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    $found = false;
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'activeTab === \'soal\'') !== false || strpos($line, 'view === \'soal\'') !== false) {
            $found = true;
            echo "Found soal view rendering at line " . ($idx + 1) . ":\n";
            for ($i = max(0, $idx - 5); $i < min(count($lines), $idx + 120); $i++) {
                echo ($i + 1) . ": " . $lines[$i];
            }
            break;
        }
    }
    if (!$found) {
        // Let's check for any general occurrence of 'soal'
        echo "No specific 'activeTab === \'soal\'' found. Listing lines containing 'soal':\n";
        foreach ($lines as $idx => $line) {
            if (strpos($line, 'soal') !== false || strpos($line, 'Soal') !== false) {
                echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
            }
        }
    }
} else {
    echo "CbtAdminDashboard.tsx does not exist\n";
}
