<?php
$logFile = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\bf72941a-4d5a-4408-9e62-c2ecc78f371a\\.system_generated\\logs\\transcript.jsonl';
$handle = fopen($logFile, 'r');
while (($line = fgets($handle)) !== false) {
    $data = json_decode($line, true);
    if (!$data) continue;
    
    // We are looking for SYSTEM response that has the view_file output of AdminDashboard.tsx
    // Let's check if the type is VIEW_FILE and status is DONE
    if (isset($data['type']) && $data['type'] === 'VIEW_FILE' && isset($data['status']) && $data['status'] === 'DONE') {
        $content = $data['content'] ?? '';
        if (strpos($content, 'const AdminDashboard: React.FC<AdminDashboardProps>') !== false) {
            echo "Step " . $data['step_index'] . " has full/partial content of AdminDashboard.tsx!\n";
            file_put_contents('scratch/admin_dashboard_step_' . $data['step_index'] . '.tsx', $content);
        }
    }
}
fclose($handle);
