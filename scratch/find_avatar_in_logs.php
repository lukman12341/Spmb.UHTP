<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if ($step < 361) {
        $content = $data['content'] ?? '';
        if (strpos($content, 'charAt(0)') !== false || strpos($content, 'bg-primary/') !== false || strpos($content, 'size-11') !== false) {
            echo "Step $step has avatar circle styling!\n";
        }
    }
}
fclose($handle);
