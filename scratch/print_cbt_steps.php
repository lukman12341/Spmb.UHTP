<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$steps = [362, 389, 398];
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if (in_array($step, $steps)) {
        echo "========================================\n";
        echo "Step $step:\n";
        echo $data['content'] . "\n";
    }
}
fclose($handle);
