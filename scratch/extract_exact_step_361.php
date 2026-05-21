<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $val = $args['ReplacementChunks'] ?? '';
        
        // Strip outer quotes if any
        if (substr($val, 0, 1) === '"' && substr($val, -1) === '"') {
            $val = json_decode($val, true);
        }
        
        // Let's replace control characters like newlines inside string literals that might break json_decode
        // We can do this by running a regex to clean up control characters, or just decode it.
        // Actually, let's see why it failed: "Control character error, possibly incorrectly encoded"
        // In JSON, control characters like literal tab or newline inside strings must be escaped.
        // Let's replace raw control characters (ASCII 0-31) with their escaped versions.
        $cleanVal = preg_replace_callback('/[\x00-\x1F]/', function($matches) {
            $char = $matches[0];
            switch ($char) {
                case "\n": return "\\n";
                case "\r": return "\\r";
                case "\t": return "\\t";
                default: return sprintf("\\u%04x", ord($char));
            }
        }, $val);
        
        $chunks = json_decode($cleanVal, true);
        if ($chunks !== null) {
            echo "Successfully cleaned and decoded JSON!\n";
            foreach ($chunks as $index => $c) {
                file_put_contents("scratch/step_361_chunk_{$index}_target.txt", $c['TargetContent']);
                file_put_contents("scratch/step_361_chunk_{$index}_replacement.txt", $c['ReplacementContent']);
                echo "  Extracted chunk $index\n";
            }
        } else {
            echo "Cleaned JSON decode failed: " . json_last_error_msg() . "\n";
            // Let's try to extract TargetContent and ReplacementContent using regex
            // The JSON is: [{"AllowMultiple":false,"EndLine":168,"ReplacementContent":"...", "StartLine":..., "TargetContent":"..."}]
            // Let's find matches of TargetContent and ReplacementContent
            preg_match_all('/"TargetContent":"(.*?)"(?=,"|\})/s', $val, $targets);
            preg_match_all('/"ReplacementContent":"(.*?)"(?=,"|\})/s', $val, $replacements);
            echo "Regex matches targets: " . count($targets[1]) . ", replacements: " . count($replacements[1]) . "\n";
        }
        break;
    }
}
fclose($handle);
