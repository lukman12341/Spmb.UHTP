<?php
function search_backups($dir) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $f;
        if (is_dir($path)) {
            search_backups($path);
        } else {
            if (strpos($f, 'AdminDashboard') !== false || strpos($f, 'backup') !== false) {
                echo "Found: $path (" . filesize($path) . " bytes)\n";
            }
        }
    }
}
search_backups('C:\\Users\\LENOVO\\.gemini\\antigravity');
echo "Search completed!\n";
