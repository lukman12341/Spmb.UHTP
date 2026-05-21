<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 361) {
        $tc = $data['tool_calls'][0];
        $args = $tc['args'] ?? $tc['arguments'] ?? [];
        $val = $args['ReplacementChunks'] ?? '';
        
        $len = strlen($val);
        echo "Val length: $len\n";
        for ($i = 0; $i < $len; $i++) {
            $ord = ord($val[$i]);
            if ($ord < 32 && $ord != 10 && $ord != 13 && $ord != 9) {
                echo "Non-standard control char at position $i: $ord\n";
            }
            if ($ord == 10 || $ord == 13) {
                // Literal newline!
                echo "Literal newline/CR at position $i: $ord\n";
            }
        }
        break;
    }
}
fclose($handle);
