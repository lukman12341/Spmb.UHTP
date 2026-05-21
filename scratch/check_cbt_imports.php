<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    for ($i = 0; $i < 40; $i++) {
        if (isset($lines[$i])) {
            echo ($i + 1) . ": " . $lines[$i];
        }
    }
}
