<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require_once __DIR__.'/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Biodata;

function normalizeExamNumber($examNumber)
{
    $val = strtoupper(trim($examNumber));
    if (strlen($val) === 12) {
        $chars = str_split($val);
        if ($chars[5] === '0') {
            $chars[5] = 'O';
        }
        if ($chars[6] === '0') {
            $chars[6] = 'O';
        }
        for ($i = 0; $i < 5; $i++) {
            if ($chars[$i] === 'O') {
                $chars[$i] = '0';
            }
        }
        for ($i = 8; $i < 12; $i++) {
            if ($chars[$i] === 'O') {
                $chars[$i] = '0';
            }
        }
        $val = implode('', $chars);
    }
    return $val;
}

$testNumbers = [
    '2026300-3693', // mistyped with zeros
    '20263OO-3693', // original with letters O
    '20263oo-3693', // lowercase letters o
];

foreach ($testNumbers as $num) {
    $normalized = normalizeExamNumber($num);
    $biodata = Biodata::where('exam_number', $normalized)->first();
    echo "Input: {$num} -> Normalized: {$normalized} -> Match: " . ($biodata ? "YES ({$biodata->registration->name})" : "NO") . "\n";
}
