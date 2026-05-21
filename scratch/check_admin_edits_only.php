<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if (isset($data['tool_calls'])) {
        foreach ($data['tool_calls'] as $tc) {
            $name = $tc['name'] ?? '';
            if (strpos($name, 'replace_file') !== false || strpos($name, 'write_to_file') !== false || strpos($name, 'write_file') !== false) {
                $args = $tc['args'] ?? $tc['arguments'] ?? [];
                if (is_string($args)) $args = json_decode($args, true);
                $targetFile = $args['TargetFile'] ?? '';
                // Match AdminDashboard.tsx but NOT CbtAdminDashboard.tsx
                if (strpos($targetFile, 'AdminDashboard.tsx') !== false && strpos($targetFile, 'CbtAdminDashboard.tsx') === false) {
                    echo "Step $step: Tool: $name - File: " . basename($targetFile) . " - Instruction: " . ($args['Instruction'] ?? 'none') . "\n";
                }
            }
        }
    }
}
fclose($handle);
