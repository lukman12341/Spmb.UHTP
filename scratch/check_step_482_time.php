<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if ($step >= 480) {
        echo "Step $step (Type: " . ($data['type'] ?? '') . ", Source: " . ($data['source'] ?? '') . ", Created At: " . ($data['created_at'] ?? '') . "): " . substr($data['content'] ?? '', 0, 100) . "\n";
    }
}
fclose($handle);
