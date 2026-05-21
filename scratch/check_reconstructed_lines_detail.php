<?php
$file = 'scratch/reconstructed_original_admin.tsx';
if (file_exists($file)) {
    $lines = file($file);
    for ($i = 490; $i < 512; $i++) {
        if (isset($lines[$i])) {
            echo ($i + 1) . ": " . $lines[$i];
        }
    }
}
