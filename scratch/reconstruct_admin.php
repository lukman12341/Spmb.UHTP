<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');

// We want to reconstruct the file using the view_file steps in this turn (step 300, 304, etc.)
// Step 300 viewed lines 1 to 800
// Step 304 viewed lines 800 to 1080

$lines = [];

while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    
    $step = $data['step_index'] ?? '';
    if (($step == 300 || $step == 304) && isset($data['type']) && $data['type'] === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
        $content = $data['content'] ?? '';
        
        // Parse lines in the content
        $contentLines = explode("\n", $content);
        foreach ($contentLines as $cl) {
            // Match the pattern: "<line_number>: <actual_code>"
            // Since the system logs might have wrapped it, let's look at the prefix like "8: 1: import ..."
            // Wait, in step 300 output we saw:
            // "8: 1: import React, { useState, useEffect } from 'react';"
            // This means there is an outer line number "8:" (from the script output) and an inner line number "1:" (from view_file).
            // Let's write a regex that matches: /^\d+:\s+(\d+):\s?(.*)$/
            // or if it's just the inner line: /^\d+:\s?(.*)$/ after splitting
            if (preg_match('/^\d+:\s+(\d+):\s?(.*)$/', $cl, $matches)) {
                $lineNum = (int)$matches[1];
                $code = $matches[2];
                // sometimes the code is empty, let's keep it
                $lines[$lineNum] = $code;
            } elseif (preg_match('/^\d+:\s?(.*)$/', $cl, $matches)) {
                // If it is just one prefix
                $code = $matches[1];
                // we don't know the line number unless we parse it from the outer prefix
                // but let's see if the outer prefix matches the line number of view_file
            }
        }
    }
}
fclose($handle);

ksort($lines);
echo "Reconstructed " . count($lines) . " lines!\n";

// Let's write the reconstructed lines to scratch/reconstructed_admin.tsx
$fileContent = "";
for ($i = 1; $i <= max(array_keys($lines)); $i++) {
    $fileContent .= ($lines[$i] ?? "") . "\r\n";
}

file_put_contents('scratch/reconstructed_admin.tsx', $fileContent);
echo "Saved to scratch/reconstructed_admin.tsx\n";
