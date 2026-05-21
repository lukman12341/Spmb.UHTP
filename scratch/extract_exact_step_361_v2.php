<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $val = $args['ReplacementChunks'] ?? '';
        
        // If the val is wrapped in literal JSON string quotes, decode it
        // Note: JSON string starts and ends with double quotes and has escapes
        // Since we want to parse it as JSON, let's decode it.
        // Wait, is it a JSON encoded string? Yes, in PHP:
        // if $val is a string, json_decode('"' . $val . '"') might decode it, or just json_decode directly
        // Let's check: json_decode('"' . $val . '"') is not correct because $val is already a JSON literal string with quotes.
        // Wait, let's see. If the JSON line itself is json_decoded, then $args['ReplacementChunks'] is already a PHP string!
        // But the PHP string contains a JSON array represented as a string, e.g. '[{"AllowMultiple":false,...}]'
        // So we can just do json_decode($val, true)!
        // Wait, why did it fail with "Control character error, possibly incorrectly encoded"?
        // Let's try JSON_INVALID_UTF8_IGNORE or cleaning up control characters.
        
        // Let's replace control characters
        // In PHP, JSON control characters can be cleaned by keeping only printable characters or escaping them
        $cleanVal = preg_replace_callback('/[\x00-\x1F]/', function($m) {
            return '\\' . ord($m[0]); // or skip
        }, $val);
        
        // Actually, let's look at what json_decode does on it
        $chunks = json_decode($val, true);
        if ($chunks === null) {
            // Let's try cleaning control characters properly
            $cleanVal = preg_replace('/[\x00-\x1F\x7F]/', '', $val);
            $chunks = json_decode($cleanVal, true);
        }
        
        if ($chunks !== null) {
            echo "Successfully decoded " . count($chunks) . " chunks!\n";
            foreach ($chunks as $index => $c) {
                file_put_contents("scratch/step_361_chunk_{$index}_target.txt", $c['TargetContent']);
                file_put_contents("scratch/step_361_chunk_{$index}_replacement.txt", $c['ReplacementContent']);
            }
        } else {
            echo "JSON decode still failed: " . json_last_error_msg() . "\n";
        }
        break;
    }
}
fclose($handle);
