<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    if (strpos($line, 'AdminDashboard.tsx') !== false) {
        $data = json_decode($line, true);
        if (!$data) continue;
        echo "Step " . ($data['step_index'] ?? '?') . " (Source: " . ($data['source'] ?? '?') . ", Type: " . ($data['type'] ?? '?') . ", Status: " . ($data['status'] ?? '?') . ")\n";
    }
}
fclose($handle);
