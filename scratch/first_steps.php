<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
$count = 0;
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    echo "Step " . ($data['step_index'] ?? '') . " (Type: " . ($data['type'] ?? '') . ", Source: " . ($data['source'] ?? '') . "): " . substr($data['content'] ?? '', 0, 100) . "\n";
    $count++;
    if ($count > 30) break;
}
fclose($handle);
