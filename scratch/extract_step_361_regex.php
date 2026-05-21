<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $val = $args['ReplacementChunks'] ?? '';
        
        // Find all occurrences of TargetContent and ReplacementContent
        // Example: \"TargetContent\":\"...\"
        // Since we want to capture everything inside the quotes, let's use a regex that handles escaped characters
        // We can match: \\"TargetContent\\":\\"(.*?)\\"(,?)\\"StartLine\\"
        // Let's print matches of TargetContent
        preg_match_all('/\\\\\"TargetContent\\\\\":\\\\\"(.*?)(?<!\\\\)\\\\\"/s', $val, $targets);
        preg_match_all('/\\\\\"ReplacementContent\\\\\":\\\\\"(.*?)(?<!\\\\)\\\\\"/s', $val, $replacements);
        
        echo "Regex targets found: " . count($targets[1]) . "\n";
        echo "Regex replacements found: " . count($replacements[1]) . "\n";
        
        foreach ($targets[1] as $idx => $t) {
            // Strip backslashes followed by n or quote to reconstruct the actual text
            // e.g., \\n -> \n, \\" -> "
            $t_un = stripcslashes($t);
            $r_un = isset($replacements[1][$idx]) ? stripcslashes($replacements[1][$idx]) : '';
            
            file_put_contents("scratch/regex_step_361_chunk_{$idx}_target.txt", $t_un);
            file_put_contents("scratch/regex_step_361_chunk_{$idx}_replacement.txt", $r_un);
            echo "Extracted regex chunk $idx!\n";
        }
        break;
    }
}
fclose($handle);
