<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (($data['step_index'] ?? '') == 342) {
        echo "Step 342 content:\n";
        echo $data['content'] . "\n";
        break;
    }
}
fclose($handle);
