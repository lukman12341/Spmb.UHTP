<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 341) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $chunks = $args['ReplacementChunks'] ?? [];
        if (is_string($chunks)) {
            $chunks = json_decode($chunks, true);
        }
        foreach ($chunks as $index => $c) {
            file_put_contents("scratch/step_341_chunk_{$index}_target.txt", $c['TargetContent']);
            file_put_contents("scratch/step_341_chunk_{$index}_replacement.txt", $c['ReplacementContent']);
        }
        echo "Extracted " . count($chunks) . " chunks!\n";
        break;
    }
}
fclose($handle);
