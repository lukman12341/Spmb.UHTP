<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if (in_array($step, [204, 575]) && isset($data['type']) && $data['type'] === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
        $content = $data['content'] ?? '';
        $lines = explode("\n", $content);
        echo "Step $step: Total lines in exploded content: " . count($lines) . "\n";
        echo "First line: " . ($lines[0] ?? '') . "\n";
        echo "Last line: " . ($lines[count($lines)-1] ?? '') . "\n";
        echo "---------------------------\n";
    }
}
fclose($handle);
