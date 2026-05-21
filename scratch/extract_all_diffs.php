<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    $type = $data['type'] ?? '';
    $content = $data['content'] ?? '';
    if ($type === 'CODE_ACTION' && strpos($content, 'AdminDashboard.tsx') !== false) {
        echo "========================================\n";
        echo "Step $step:\n";
        echo $content . "\n";
    }
}
fclose($handle);
