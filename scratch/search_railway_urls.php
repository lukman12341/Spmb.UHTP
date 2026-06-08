<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\f12e212e-eccd-487e-b02b-18625d5d612b\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
if ($handle) {
    while (($line = fgets($handle)) !== false) {
        if (stripos($line, 'railway.app') !== false || stripos($line, 'railway') !== false) {
            // Find matches and print the surrounding context
            if (preg_match_all('/https?:\/\/[^\s"\'}]+/i', $line, $matches)) {
                foreach ($matches[0] as $match) {
                    echo "Found URL: $match\n";
                }
            }
        }
    }
    fclose($handle);
}
