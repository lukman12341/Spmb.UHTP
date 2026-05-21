<?php
$file = 'src/CbtAdminDashboard.tsx';
if (file_exists($file)) {
    $lines = file($file);
    echo "--- Lines 270 to 290 ---\n";
    for ($i = 269; $i < min(count($lines), 290); $i++) {
        echo ($i + 1) . ": " . $lines[$i];
    }
    echo "\n--- Lines 990 to 1015 ---\n";
    for ($i = 989; $i < min(count($lines), 1015); $i++) {
        echo ($i + 1) . ": " . $lines[$i];
    }
}
