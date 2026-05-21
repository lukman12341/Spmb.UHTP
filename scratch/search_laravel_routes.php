<?php
$file = 'backend/routes/api.php';
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "api.php does not exist\n";
}
