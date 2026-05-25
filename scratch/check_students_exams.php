<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$registrations = App\Models\Registration::with(['biodata', 'examResult', 'healthTest'])->get();
foreach ($registrations as $r) {
    $b = $r->biodata;
    $e = $r->examResult;
    $h = $r->healthTest;
    echo "Nama: {$r->name}\n";
    echo "  Exam Number: " . ($b->exam_number ?? 'NULL') . "\n";
    echo "  Exam score: " . ($e->total_score ?? 'NULL') . "\n";
    echo "  Exam status_kelulusan: " . ($e->status_kelulusan ?? 'NULL') . "\n";
    echo "  Health status: " . ($h->status_kesehatan ?? 'NULL') . "\n";
    echo "  Interview result: " . ($b->hasil_wawancara ?? 'NULL') . "\n";
    echo "  Status Registrasi: " . ($b->status_registrasi ?? 'NULL') . "\n";
    echo "---------------------------------\n";
}
