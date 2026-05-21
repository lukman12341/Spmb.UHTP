<?php
function search_workspace($dir) {
    if (!is_dir($dir)) return;
    // Skip node_modules and backend vendor/storage/bootstrap
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if ($f === 'node_modules' || $f === 'vendor' || $f === '.git') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $f;
        if (is_dir($path)) {
            search_workspace($path);
        } else {
            if (strpos($f, 'AdminDashboard') !== false || strpos($f, 'bak') !== false || strpos($f, 'old') !== false) {
                echo "Found: $path (" . filesize($path) . " bytes)\n";
            }
        }
    }
}
search_workspace('c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing');
echo "Search completed!\n";
