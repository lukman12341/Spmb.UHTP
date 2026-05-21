<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
$steps = [361, 362, 388, 389, 396, 397, 398, 423, 424, 482, 483];
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if (in_array($step, $steps)) {
        if (isset($data['tool_calls'])) {
            echo "Step $step (Type: " . $data['type'] . "): " . json_encode($data['tool_calls'][0]['name']) . "\n";
            $tc = $data['tool_calls'][0];
            $args = $tc['args'] ?? $tc['arguments'] ?? [];
            if (is_string($args)) {
                $args = json_decode($args, true);
            }
            if (isset($args['ReplacementChunks'])) {
                $chunks = $args['ReplacementChunks'];
                if (is_string($chunks)) $chunks = json_decode($chunks, true);
                foreach ($chunks as $index => $c) {
                    file_put_contents("scratch/step_{$step}_chunk_{$index}_target.txt", $c['TargetContent']);
                    file_put_contents("scratch/step_{$step}_chunk_{$index}_replacement.txt", $c['ReplacementContent']);
                    echo "  Extracted chunk $index (Start: {$c['StartLine']}, End: {$c['EndLine']})\n";
                }
            } elseif (isset($args['TargetContent'])) {
                file_put_contents("scratch/step_{$step}_target.txt", $args['TargetContent']);
                file_put_contents("scratch/step_{$step}_replacement.txt", $args['ReplacementContent']);
                echo "  Extracted single replacement!\n";
            } else {
                echo "  No TargetContent/Chunks keys: " . implode(', ', array_keys($args)) . "\n";
            }
        }
    }
}
fclose($handle);
