<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
$found = false;
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    $step = $data['step_index'] ?? '';
    if ($step == 300) {
        $found = true;
        // Output type and content preview
        echo "Found Step 300. Type: " . ($data['type'] ?? '') . "\n";
        
        // Let's inspect the keys of $data
        echo "Keys: " . implode(', ', array_keys($data)) . "\n";
        
        // If there's tool_calls or response/output, let's find it.
        if (isset($data['tool_calls'])) {
            echo "Has tool_calls\n";
            foreach ($data['tool_calls'] as $tc) {
                echo "Tool: " . ($tc['ToolName'] ?? $tc['name'] ?? '') . "\n";
            }
        }
        
        // Let's search for the actual content of the file
        // Sometimes it is inside output or tool_results
        $res = $data['output'] ?? $data['content'] ?? '';
        echo "Content length: " . strlen($res) . "\n";
        if (strlen($res) > 0) {
            file_put_contents('scratch/step_300_content.txt', $res);
            echo "Wrote content to scratch/step_300_content.txt\n";
        }
    }
}
fclose($handle);
if (!$found) {
    echo "Step 300 not found\n";
}
