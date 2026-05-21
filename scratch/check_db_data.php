<?php
// Bootstrap Laravel
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "--- Registrations ---\n";
$regs = DB::table('registrations')->get();
foreach ($regs as $r) {
    echo "ID: {$r->id} | Name: {$r->name} | Program: {$r->program_studi}\n";
}

echo "\n--- Biodatas ---\n";
$biodatas = DB::table('biodatas')->get();
foreach ($biodatas as $b) {
    echo "ID: {$b->id} | Reg ID: {$b->registration_id} | Exam: {$b->exam_number} | Finalized: {$b->is_finalized}\n";
}
