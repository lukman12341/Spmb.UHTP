<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $val = $args['ReplacementChunks'] ?? '';
        echo "Type: " . gettype($val) . "\n";
        echo "Length: " . strlen($val) . "\n";
        echo "First 50 chars: " . substr($val, 0, 50) . "\n";
        echo "Last 50 chars: " . substr($val, -50) . "\n";
        
        // Let's try json_decode with JSON_THROW_ON_ERROR
        try {
            $decoded = json_decode($val, true, 512, JSON_THROW_ON_ERROR);
            echo "Successfully decoded with JSON_THROW_ON_ERROR!\n";
        } catch (Exception $e) {
            echo "Failed to decode: " . $e->getMessage() . "\n";
        }
        break;
    }
}
fclose($handle);
