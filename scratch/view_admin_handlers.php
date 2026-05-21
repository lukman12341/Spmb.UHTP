<?php
$file = 'src/AdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    for ($i = 250; $i < 330; $i++) {
        if (isset($lines[$i])) {
            echo ($i + 1) . ": " . $lines[$i];
        }
    }
}
