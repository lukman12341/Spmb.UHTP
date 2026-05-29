<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\Biodata;

$r = Registration::where('name', 'like', '%Lukman%')->first();

if (!$r) {
    echo "Could not find registration for Lukman\n";
    exit(1);
}

$newExamNumber = "20263SI-1002";

// 1. Update biodatas table
$biodata = Biodata::where('registration_id', $r->id)->first();
if ($biodata) {
    $biodata->exam_number = $newExamNumber;
    $biodata->is_finalized = true;
    $biodata->save();
} else {
    // If biodata doesn't exist, create it
    $biodata = new Biodata();
    $biodata->registration_id = $r->id;
    $biodata->exam_number = $newExamNumber;
    $biodata->is_finalized = true;
    $biodata->save();
}

echo "Successfully updated M. Lukman Hakim:\n";
echo "- Biodata exam_number: " . $biodata->exam_number . "\n";
echo "- Biodata is_finalized: " . ($biodata->is_finalized ? "Yes" : "No") . "\n";
