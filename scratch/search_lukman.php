<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\Biodata;
use App\Models\HealthTest;

$registrations = Registration::where('name', 'like', '%Lukman%')->get();

echo "Found " . $registrations->count() . " records matching 'Lukman':\n\n";

foreach ($registrations as $r) {
    echo "ID: " . $r->id . "\n";
    echo "Name: " . $r->name . "\n";
    echo "Prodi: " . $r->program_studi . "\n";
    echo "Gelombang: " . $r->gelombang . "\n";
    echo "No Ujian: " . $r->no_ujian . "\n";
    
    $biodata = Biodata::where('registration_id', $r->id)->first();
    if ($biodata) {
        echo "Biodata status_kesehatan: " . ($biodata->status_kesehatan ?? "NULL") . "\n";
        echo "Biodata status: " . ($biodata->status ?? "NULL") . "\n";
        echo "Biodata hasil_wawancara: " . ($biodata->hasil_wawancara ?? "NULL") . "\n";
        echo "Biodata status_registrasi: " . ($biodata->status_registrasi ?? "NULL") . "\n";
        echo "Biodata is_finalized: " . ($biodata->is_finalized ? "Yes" : "No") . "\n";
    } else {
        echo "Biodata: None\n";
    }
    echo "---------------------------------\n";
}
