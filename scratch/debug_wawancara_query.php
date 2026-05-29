<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;

// Run the base query from AdminKesehatanController
$query = Registration::with(['biodata', 'examResult', 'healthTest', 'interviewAnswers.soal'])
    ->whereHas('biodata', function ($q) {
        $q->whereNotNull('exam_number');
    });

// Filter by gelombang 20263
$query->where('gelombang', '20263');

$results = $query->get();

echo "Query returned " . $results->count() . " registrations:\n\n";
foreach ($results as $r) {
    echo "ID: " . $r->id . ", Name: " . $r->name . ", Prodi: " . $r->program_studi . ", Exam Number: " . ($r->biodata->exam_number ?? 'NULL') . "\n";
}

echo "\nChecking registration for M. Lukman Hakim specifically:\n";
$lukmanReg = Registration::where('name', 'like', '%Lukman%')->first();
if ($lukmanReg) {
    echo "Registration exists with ID: " . $lukmanReg->id . "\n";
    echo "Gelombang: " . $lukmanReg->gelombang . "\n";
    
    $hasBiodata = $lukmanReg->biodata()->exists();
    echo "Has biodata relation: " . ($hasBiodata ? "Yes" : "No") . "\n";
    if ($hasBiodata) {
        $b = $lukmanReg->biodata;
        echo "Biodata exam_number: " . ($b->exam_number ?? 'NULL') . "\n";
        echo "Biodata is_finalized: " . ($b->is_finalized ? "Yes" : "No") . "\n";
    }
} else {
    echo "M. Lukman Hakim registration not found!\n";
}
