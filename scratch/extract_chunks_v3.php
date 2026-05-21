<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
$steps = [361, 388, 397, 423, 482];

while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if (in_array($step, $steps)) {
        if (isset($data['tool_calls'])) {
            $tc = $data['tool_calls'][0];
            $args = $tc['args'] ?? $tc['arguments'] ?? [];
            
            // If the args is a string, decode it
            if (is_string($args)) {
                $args = json_decode($args, true);
            }
            
            echo "Step $step:\n";
            
            // For each key, if the value is a string that starts with [ or {, let's json_decode it
            foreach ($args as $key => $val) {
                if (is_string($val)) {
                    // Sometimes it's wrapped in literal quotes
                    if (substr($val, 0, 1) === '"' && substr($val, -1) === '"') {
                        // strip outer quotes and unescape
                        $decodedVal = json_decode($val, true);
                        if ($decodedVal !== null) {
                            $val = $decodedVal;
                        }
                    }
                    
                    if (is_string($val) && (substr($val, 0, 1) === '[' || substr($val, 0, 1) === '{')) {
                        $decodedVal = json_decode($val, true);
                        if ($decodedVal !== null) {
                            $val = $decodedVal;
                        }
                    }
                }
                $args[$key] = $val;
            }
            
            if (isset($args['ReplacementChunks'])) {
                $chunks = $args['ReplacementChunks'];
                foreach ($chunks as $index => $c) {
                    file_put_contents("scratch/step_{$step}_chunk_{$index}_target.txt", $c['TargetContent']);
                    file_put_contents("scratch/step_{$step}_chunk_{$index}_replacement.txt", $c['ReplacementContent']);
                    echo "  Extracted chunk $index\n";
                }
            } elseif (isset($args['TargetContent'])) {
                file_put_contents("scratch/step_{$step}_target.txt", $args['TargetContent']);
                file_put_contents("scratch/step_{$step}_replacement.txt", $args['ReplacementContent']);
                echo "  Extracted single replacement!\n";
            } else {
                echo "  No target/chunks keys: " . implode(', ', array_keys($args)) . "\n";
            }
        }
    }
}
fclose($handle);
