<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    if (strpos($line, 'AdminDashboard.tsx') !== false) {
        $data = json_decode($line, true);
        if (isset($data['tool_calls'])) {
            foreach ($data['tool_calls'] as $tc) {
                if ($tc['name'] === 'view_file' || $tc['name'] === 'default_api:view_file') {
                    echo "Found view_file call in step " . ($data['step_index'] ?? 'unknown') . "\n";
                    echo "Args: " . json_encode($tc['arguments']) . "\n";
                }
            }
        }
        if (isset($data['content']) && strpos($data['content'], 'AdminDashboard.tsx') !== false) {
            echo "Found content reference in step " . ($data['step_index'] ?? 'unknown') . "\n";
        }
        if (isset($data['type']) && $data['type'] === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
            echo "Found VIEW_FILE step: " . ($data['step_index'] ?? 'unknown') . "\n";
            // Check if this contains our content
            if (strpos($data['content'], 'class AdminDashboard') !== false || strpos($data['content'], 'const AdminDashboard') !== false) {
                echo "This step contains the AdminDashboard file contents!\n";
                file_put_contents('scratch/restored_admin_dashboard.txt', $data['content']);
            }
        }
    }
}
fclose($handle);
