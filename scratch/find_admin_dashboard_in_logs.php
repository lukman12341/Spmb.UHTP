<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    
    // Check if the step has tool calls to see if they access AdminDashboard.tsx
    $tool_calls = $data['tool_calls'] ?? [];
    $accessed = false;
    foreach ($tool_calls as $tc) {
        $args = $tc['Arguments'] ?? $tc['arguments'] ?? [];
        $argsStr = json_encode($args);
        if (strpos($argsStr, 'AdminDashboard.tsx') !== false) {
            $accessed = true;
        }
    }
    
    // Also check content
    $content = $data['content'] ?? '';
    if (strpos($content, 'AdminDashboard.tsx') !== false) {
        $accessed = true;
    }
    
    if ($accessed) {
        echo "Step $step (Type: " . ($data['type'] ?? '') . ", Source: " . ($data['source'] ?? '') . ", Created At: " . ($data['created_at'] ?? '') . ")\n";
    }
}
fclose($handle);
