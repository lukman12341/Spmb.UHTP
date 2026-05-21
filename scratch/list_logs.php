<?php
function list_dir($dir) {
    if (!is_dir($dir)) return;
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $f;
        if (is_dir($path)) {
            echo "Dir: $path\n";
            list_dir($path);
        } else {
            echo "File: $path (" . filesize($path) . " bytes)\n";
        }
    }
}
list_dir('C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a');
