<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\Biodata;
use App\Models\ExamResult;

// Find M. Lukman Hakim (Reg ID: 2)
$r = Registration::find(2);

if (!$r) {
    echo "Could not find registration with ID 2\n";
    exit(1);
}

$newExamNumber = "20263OO-3693";

// 1. Update biodatas table
$biodata = Biodata::where('registration_id', $r->id)->first();
if ($biodata) {
    $biodata->exam_number = $newExamNumber;
    $biodata->is_finalized = true;
    $biodata->save();
} else {
    $biodata = new Biodata();
    $biodata->registration_id = $r->id;
    $biodata->exam_number = $newExamNumber;
    $biodata->is_finalized = true;
    $biodata->save();
}

echo "Successfully updated M. Lukman Hakim:\n";
echo "- Name: " . $r->name . "\n";
echo "- Biodata exam_number: " . $biodata->exam_number . "\n";
echo "- Biodata is_finalized: " . ($biodata->is_finalized ? "Yes" : "No") . "\n";
