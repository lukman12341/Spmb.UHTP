<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 341) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        file_put_contents('scratch/step_341_target.txt', $args['TargetContent']);
        file_put_contents('scratch/step_341_replacement.txt', $args['ReplacementContent']);
        echo "Step 341 extracted!\n";
        break;
    }
}
fclose($handle);
