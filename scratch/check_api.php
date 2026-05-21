<?php
$d = json_decode(file_get_contents('http://localhost:8000/api/admin/biodatas'), true);
foreach($d as $index => $item) {
    echo $index . ": " . ($item['registration']['name'] ?? 'no name') . " -> ID: " . ($item['id'] ?? 'null') . "\n";
}
