<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    if (strpos($line, 'view_file') !== false && strpos($line, 'AdminDashboard') !== false) {
        echo substr($line, 0, 1000) . "\n";
        break;
    }
}
fclose($handle);
