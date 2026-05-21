<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
if (!file_exists($logFile)) {
    die("Log file does not exist\n");
}

$handle = fopen($logFile, 'r');
if (!$handle) {
    die("Cannot open log file\n");
}

// We want to find the first time src/AdminDashboard.tsx was read
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['tool_calls'])) {
        foreach ($data['tool_calls'] as $tc) {
            if ($tc['name'] === 'view_file' || $tc['name'] === 'default_api:view_file') {
                $args = $tc['arguments'] ?? [];
                if (isset($args['AbsolutePath']) && strpos($args['AbsolutePath'], 'AdminDashboard.tsx') !== false) {
                    echo "Found view_file call in step " . ($data['step_index'] ?? 'unknown') . "\n";
                }
            }
        }
    }
}
fclose($handle);
