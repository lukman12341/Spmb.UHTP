<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (isset($data['step_index']) && $data['step_index'] == 300) {
        $content = $data['content'] ?? '';
        $lines = explode("\n", $content);
        for ($i = 0; $i < 15; $i++) {
            if (isset($lines[$i])) {
                echo "$i: " . bin2hex($lines[$i]) . " -> " . $lines[$i] . "\n";
            }
        }
        break;
    }
}
fclose($handle);
