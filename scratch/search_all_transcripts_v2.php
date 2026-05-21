<?php
$brainDir = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain';
$convs = scandir($brainDir);

foreach ($convs as $c) {
    if ($c === '.' || $c === '..') continue;
    $logFile = $brainDir . DIRECTORY_SEPARATOR . $c . DIRECTORY_SEPARATOR . '.system_generated' . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'transcript.jsonl';
    if (!file_exists($logFile)) continue;
    
    $handle = fopen($logFile, 'r');
    while (($line = fgets($handle)) !== false) {
        $data = json_decode($line, true);
        if (!$data) continue;
        
        $type = $data['type'] ?? '';
        $step = $data['step_index'] ?? '';
        if ($type === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
            $content = $data['content'] ?? '';
            if (strpos($content, 'AdminDashboard.tsx') !== false) {
                // Count lines
                $lines = explode("\n", $content);
                echo "Found in Conv $c, Step $step: " . count($lines) . " lines!\n";
            }
        }
    }
    fclose($handle);
}
echo "Global search v2 completed!\n";
