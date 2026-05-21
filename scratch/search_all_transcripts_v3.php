<?php
$brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain';
$convs = scandir($brainDir);

foreach ($convs as $c) {
    if ($c === '.' || $c === '..') continue;
    $logFile = $brainDir . DIRECTORY_SEPARATOR . $c . DIRECTORY_SEPARATOR . '.system_generated' . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'transcript.jsonl';
    if (!file_exists($logFile)) continue;
    
    $handle = fopen($logFile, 'r');
    while (($line = fgets($handle)) !== false) {
        if (strpos($line, 'AdminDashboard.tsx') !== false) {
            $data = json_decode($line, true);
            if (!$data) continue;
            $step = $data['step_index'] ?? '';
            $type = $data['type'] ?? '';
            $source = $data['source'] ?? '';
            
            // Check if this step contains file content or a write tool call
            echo "Found match in Conv $c, Step $step (Type: $type, Source: $source)\n";
            
            // If it's a WRITE_TO_FILE or CODE_ACTION, and it's a SYSTEM/DONE or MODEL call,
            // let's check if we can find file content
            if ($type === 'CODE_ACTION' || $type === 'WRITE_TO_FILE') {
                $content = $data['content'] ?? '';
                if (strlen($content) > 5000 && strpos($content, 'const AdminDashboard') !== false) {
                    echo "  -> Found content of size " . strlen($content) . " in step $step!\n";
                    file_put_contents("scratch/reconstructed_from_{$c}_step_{$step}.tsx", $content);
                }
            }
        }
    }
    fclose($handle);
}
echo "Comprehensive search completed!\n";
