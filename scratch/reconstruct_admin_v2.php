<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');

$lines = [];

while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    
    $step = $data['step_index'] ?? '';
    // Reconstruct using step 300 (lines 1 to 800) and step 304 (lines 800 to 1080)
    if (($step == 300 || $step == 304) && isset($data['type']) && $data['type'] === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
        $content = $data['content'] ?? '';
        $contentLines = explode("\n", $content);
        foreach ($contentLines as $cl) {
            // Strip trailing carriage return if any
            $cl = rtrim($cl, "\r");
            if (preg_match('/^(\d+):(.*)$/', $cl, $matches)) {
                $lineNum = (int)$matches[1];
                $code = $matches[2];
                $lines[$lineNum] = $code;
            }
        }
    }
}
fclose($handle);

ksort($lines);
echo "Reconstructed " . count($lines) . " lines!\n";

if (count($lines) > 0) {
    $fileContent = "";
    $maxLine = max(array_keys($lines));
    for ($i = 1; $i <= $maxLine; $i++) {
        // If a line is missing, let's keep it empty
        $fileContent .= ($lines[$i] ?? "") . "\r\n";
    }
    file_put_contents('scratch/reconstructed_admin.tsx', $fileContent);
    echo "Saved " . strlen($fileContent) . " bytes to scratch/reconstructed_admin.tsx\n";
} else {
    echo "No lines reconstructed. Please check regex.\n";
}
