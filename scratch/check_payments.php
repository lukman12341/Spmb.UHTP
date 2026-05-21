<?php
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "--- Payments ---\n";
$payments = DB::table('payments')->get();
foreach ($payments as $p) {
    echo "ID: {$p->id} | Reg ID: {$p->registration_id} | Amount: {$p->jumlah_bayar} | Status: {$p->status_pembayaran}\n";
}
