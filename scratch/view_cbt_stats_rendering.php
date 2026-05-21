<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    for ($i = 1500; $i < 1600; $i++) {
        if (isset($lines[$i])) {
            echo ($i + 1) . ": " . $lines[$i];
        }
    }
}
