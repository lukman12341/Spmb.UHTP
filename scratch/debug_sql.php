<?php
$sqlFile = 'C:\\Users\\LENOVO\\Downloads\\soals.sql';
$sql = file_get_contents($sqlFile);

// Remove C-style block comments (including MySQL conditional comments /*! ... */)
$sql = preg_replace('/\/\\*[\s\S]*?\\*\/;?/i', '', $sql);

// Remove SQL line comments
$sql = preg_replace('/^[ \t]*--.*$/m', '', $sql);
$sql = preg_replace('/^[ \t]*#.*$/m', '', $sql);

// Remove phpMyAdmin/MySQL transactions and settings
$sql = preg_replace('/SET\s+[A-Z_]+\s*=\s*[^;]+;/i', '', $sql);
$sql = str_ireplace('START TRANSACTION;', '', $sql);
$sql = str_ireplace('COMMIT;', '', $sql);

// Remove CREATE TABLE block
$sql = preg_replace('/CREATE TABLE\s+`soals`[\s\S]+?ENGINE=[^;]+;/i', '', $sql);

// Remove ALTER TABLE blocks
$sql = preg_replace('/ALTER TABLE\s+`soals`[\s\S]+?;/i', '', $sql);

$sql = trim($sql);

echo "Length of cleaned SQL: " . strlen($sql) . "\n";
echo "First 500 chars:\n";
echo substr($sql, 0, 500) . "\n";
echo "Last 500 chars:\n";
echo substr($sql, -500) . "\n";
