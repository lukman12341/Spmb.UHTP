<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    $tool_calls = $data['tool_calls'] ?? [];
    foreach ($tool_calls as $tc) {
        $name = $tc['ToolName'] ?? $tc['name'] ?? '';
        if (in_array($name, ['replace_file_content', 'multi_replace_file_content'])) {
            $args = $tc['Arguments'] ?? $tc['arguments'] ?? [];
            $target = $args['TargetFile'] ?? $args['targetFile'] ?? '';
            if (strpos($target, 'AdminDashboard.tsx') !== false) {
                echo "Step $step (Tool: $name):\n";
                echo "Instruction: " . ($args['Instruction'] ?? $args['instruction'] ?? '') . "\n";
                echo "Description: " . ($args['Description'] ?? $args['description'] ?? '') . "\n";
                if ($name === 'replace_file_content') {
                    echo "TargetContent: " . substr($args['TargetContent'] ?? $args['targetContent'] ?? '', 0, 150) . "...\n";
                    echo "ReplacementContent: " . substr($args['ReplacementContent'] ?? $args['replacementContent'] ?? '', 0, 150) . "...\n";
                } else {
                    $chunks = $args['ReplacementChunks'] ?? $args['replacementChunks'] ?? [];
                    echo "Number of chunks: " . count($chunks) . "\n";
                    foreach ($chunks as $idx => $chunk) {
                        echo "  Chunk $idx: Target: " . substr($chunk['TargetContent'] ?? $chunk['targetContent'] ?? '', 0, 100) . "...\n";
                        echo "  Chunk $idx: Replacement: " . substr($chunk['ReplacementContent'] ?? $chunk['replacementContent'] ?? '', 0, 100) . "...\n";
                    }
                }
                echo "----------------------------------------\n";
            }
        }
    }
}
fclose($handle);
