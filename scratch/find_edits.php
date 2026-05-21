<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    
    // We are looking for tool_calls inside the MODEL step that did edits on AdminDashboard.tsx
    if (isset($data['tool_calls'])) {
        foreach ($data['tool_calls'] as $tc) {
            if ($tc['name'] === 'replace_file_content' || $tc['name'] === 'default_api:replace_file_content' ||
                $tc['name'] === 'multi_replace_file_content' || $tc['name'] === 'default_api:multi_replace_file_content') {
                $args = $tc['args'] ?? $tc['arguments'] ?? [];
                $targetFile = $args['TargetFile'] ?? '';
                if (strpos($targetFile, 'AdminDashboard.tsx') !== false) {
                    echo "Step $step: Tool: " . $tc['name'] . "\n";
                    echo "TargetContent / replacement:\n";
                    if (isset($args['ReplacementChunk'])) {
                        echo json_encode($args['ReplacementChunk'], JSON_PRETTY_PRINT) . "\n";
                    } elseif (isset($args['ReplacementChunks'])) {
                        echo json_encode($args['ReplacementChunks'], JSON_PRETTY_PRINT) . "\n";
                    } else {
                        echo "Target: " . ($args['TargetContent'] ?? 'null') . "\n";
                        echo "Replacement: " . ($args['ReplacementContent'] ?? 'null') . "\n";
                    }
                    echo "----------------------------------------\n";
                }
            }
        }
    }
}
fclose($handle);
