<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\Biodata;
use App\Models\ExamResult;

echo "--- Searching Biodatas by exam_number containing '3693' ---\n";
$bios = Biodata::where('exam_number', 'like', '%3693%')->get();
foreach ($bios as $b) {
    $r = $b->registration;
    echo "Reg ID: " . ($r->id ?? 'null') . ", Name: " . ($r->name ?? 'null') . ", Exam Number: " . ($b->exam_number ?? 'null') . "\n";
}

echo "\n--- Searching Registrations by name containing 'Lukman' ---\n";
$regs = Registration::where('name', 'like', '%Lukman%')->get();
foreach ($regs as $r) {
    $b = $r->biodata;
    echo "Reg ID: {$r->id}, Name: {$r->name}, Prodi: {$r->program_studi}\n";
    if ($b) {
        echo "  Biodata Exam Number: " . ($b->exam_number ?? 'null') . "\n";
    } else {
        echo "  No Biodata.\n";
    }
}

echo "\n--- Checking all registrations in database (first 10) ---\n";
$all = Registration::take(10)->get();
foreach ($all as $r) {
    $b = $r->biodata;
    echo "Reg ID: {$r->id}, Name: {$r->name}, Exam No: " . ($b->exam_number ?? 'null') . "\n";
}
