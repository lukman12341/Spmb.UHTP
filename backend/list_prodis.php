<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Prodi;
use App\Models\Registration;

echo "Prodis in DB:\n";
foreach (Prodi::all() as $p) {
    echo "- {$p->nama_prodi}\n";
}

echo "\nUnique Program Studi in Registrations:\n";
$prodis = Registration::whereNotNull('program_studi')->distinct()->pluck('program_studi');
foreach ($prodis as $p) {
    echo "- $p\n";
}
