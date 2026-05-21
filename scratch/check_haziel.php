<?php
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';

use App\Models\Biodata;
use App\Models\InterviewAnswer;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$no_ujian = '20264JT-1286';
$biodata = Biodata::where('exam_number', $no_ujian)->first();

if ($biodata) {
    echo "Biodata found for " . $biodata->registration->name . "\n";
    echo "Hasil Wawancara Status: " . ($biodata->hasil_wawancara ?? 'NULL') . "\n";
    
    $answers = InterviewAnswer::where('registration_id', $biodata->registration_id)->get();
    echo "Interview Answers count in DB: " . $answers->count() . "\n";
} else {
    echo "Biodata NOT found for $no_ujian\n";
}
