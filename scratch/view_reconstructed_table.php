<?php
$file = 'scratch/reconstructed_original_admin.tsx';
if (file_exists($file)) {
    $lines = file($file);
    $found = false;
    foreach ($lines as $idx => $line) {
        if (strpos($line, 'activeTab === \'students\'') !== false || strpos($line, 'biodatas.filter') !== false) {
            $found = true;
            $start = max(0, $idx - 10);
            $end = min(count($lines), $idx + 80);
            echo "Found matching table rendering code at line " . ($idx + 1) . ":\n";
            for ($i = $start; $i < $end; $i++) {
                echo ($i + 1) . ": " . $lines[$i];
            }
            break;
        }
    }
    if (!$found) echo "Not found.\n";
} else {
    echo "Reconstructed file does not exist.\n";
}
