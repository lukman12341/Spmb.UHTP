<?php
$dir = 'c:\\Users\\LENOVO\\Documents\\kerja praktik\\spmb-landing\\dist\\assets';
if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $f;
        echo "$f - Size: " . filesize($path) . " bytes - Mod Time: " . date("Y-m-d H:i:s", filemtime($path)) . "\n";
    }
} else {
    echo "dist/assets does not exist\n";
}
