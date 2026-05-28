<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\Biodata;
use App\Models\ExamResult;

echo "Registrations:\n";
foreach (Registration::all() as $r) {
    echo "ID: {$r->id}, Name: {$r->name}, Email: {$r->email}\n";
}

echo "\nBiodatas:\n";
foreach (Biodata::all() as $b) {
    echo "ID: {$b->id}, RegID: {$b->registration_id}, ExamNum: {$b->exam_number}, Name: " . ($b->registration->name ?? 'NULL') . "\n";
}

echo "\nExam Results:\n";
foreach (ExamResult::all() as $er) {
    echo "ID: {$er->id}, RegID: {$er->registration_id}, Score: {$er->total_score}\n";
}
