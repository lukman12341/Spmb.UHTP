<?php
$file = 'scratch/reconstructed_original_admin.tsx';
if (file_exists($file)) {
    $lines = file($file);
    $start = 180;
    $end = min(count($lines), 300);
    echo "Lines $start to $end:\n";
    for ($i = $start; $i < $end; $i++) {
        echo ($i + 1) . ": " . $lines[$i];
    }
} else {
    echo "Reconstructed file does not exist\n";
}
