<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\HealthTest;
use App\Models\Biodata;

$registrations = Registration::where('program_studi', 'like', '%profesi%')
    ->where(function($query) {
        $query->where('program_studi', 'like', '%ners%')
              ->orWhere('program_studi', 'like', '%bidan%');
    })
    ->get();

echo "Found " . $registrations->count() . " registrations for Profesi Ners / Bidan:\n\n";

foreach ($registrations as $r) {
    echo "ID: " . $r->id . "\n";
    echo "Name: " . $r->name . "\n";
    echo "Prodi: " . $r->program_studi . "\n";
    
    $healthTest = HealthTest::where('registration_id', $r->id)->first();
    echo "Health Test: " . ($healthTest ? "Exists (ID: " . $healthTest->id . ", Status: " . $healthTest->status_kesehatan . ")" : "None") . "\n";
    
    $biodata = Biodata::where('registration_id', $r->id)->first();
    if ($biodata) {
        echo "Biodata status_kesehatan: " . ($biodata->status_kesehatan ?? "NULL") . "\n";
        echo "Biodata tinggi_badan: " . ($biodata->tinggi_badan ?? "NULL") . "\n";
    } else {
        echo "Biodata: None\n";
    }
    echo "---------------------------------\n";
}
