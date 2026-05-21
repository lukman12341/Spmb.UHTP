<?php
$dir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain';
$files = scandir($dir);
foreach ($files as $f) {
    if ($f === '.' || $f === '..') continue;
    $path = $dir . DIRECTORY_SEPARATOR . $f;
    if (is_dir($path)) {
        echo "Conv ID: $f\n";
    }
}
