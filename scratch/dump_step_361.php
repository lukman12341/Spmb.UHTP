<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        echo "Tool name: " . $tc['name'] . "\n";
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        echo "Keys: " . implode(', ', array_keys($args)) . "\n";
        echo "JSON args: " . json_encode($args) . "\n";
        break;
    }
}
fclose($handle);
