<?php
$file = 'scratch/reconstructed_original_admin.tsx';
if (file_exists($file)) {
    $lines = file($file);
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'detail') !== false || strpos($line, 'Detail') !== false || strpos($line, 'key={b') !== false) {
            echo "Line " . ($idx + 1) . ": " . trim($line) . "\n";
        }
    }
} else {
    echo "Reconstructed file does not exist.\n";
}
