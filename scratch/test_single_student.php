<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$reg = App\Models\Registration::with(['biodata', 'examResult', 'healthTest'])->where('name', 'wildan alif')->first();

$isS2Kesmas = stripos($reg->program_studi, 'kesmas') !== false;
$status_kesehatan = $reg->healthTest->status_kesehatan ?? null;
$hasil_wawancara = $reg->biodata->hasil_wawancara ?? null;
$status_cbt = $reg->examResult->status_kelulusan ?? null;

$isHealthFailed = ($status_kesehatan && !in_array($status_kesehatan, ['Sehat', 'Lulus', 'Menunggu']));

echo "Program Studi: '{$reg->program_studi}'\n";
echo "isS2Kesmas: " . ($isS2Kesmas ? 'true' : 'false') . "\n";
echo "status_kesehatan: '{$status_kesehatan}'\n";
echo "hasil_wawancara: " . ($hasil_wawancara ?? 'null') . "\n";
echo "status_cbt: '{$status_cbt}'\n";
echo "isHealthFailed: " . ($isHealthFailed ? 'true' : 'false') . "\n";

$finalStatus = 'Proses';
$manualStatuses = [
    'Cadangan', 
    'Lulus Di S1 Kesmas Jalur A Reguler', 
    'Lulus Di S1 Kesmas Jalur B (Transfer)',
    'Lulus Di S1 Keperawatan',
    'Lulus Di Profesi Ners',
    'Lulus Di S1 Kebidanan',
    'Lulus Di Profesi Bidan',
    'S1 Kesmas Jalur A Reguler', 
    'S1 Kesmas Jalur B (Transfer)',
    'S1 Keperawatan',
    'Profesi Ners',
    'S1 Kebidanan',
    'Profesi Bidan'
];

if ($status_cbt && in_array($status_cbt, $manualStatuses)) {
    $finalStatus = $status_cbt;
    echo "Matched manualStatuses\n";
} elseif ($isHealthFailed) {
    $finalStatus = 'Tidak Lulus';
    echo "Matched isHealthFailed\n";
} elseif ($status_cbt === 'Lulus' && ($isS2Kesmas || in_array($status_kesehatan, ['Sehat', 'Lulus'])) && (!$hasil_wawancara || $hasil_wawancara === 'LULUS')) {
    echo "Matched main Lulus condition\n";
    if (!$isS2Kesmas && in_array(strtolower($reg->program_studi), ['profesi ners', 's1 keperawatan', 's1 kebidanan', 'profesi bidan'])) {
        $finalStatus = $hasil_wawancara === 'LULUS' ? 'Lulus' : 'Proses';
        echo "Check inner program_studi - set to $finalStatus\n";
    } else {
        $finalStatus = 'Lulus';
        echo "Check inner program_studi - else set to Lulus\n";
    }
} else {
    echo "No conditions matched. Default to Proses\n";
}

echo "Final calculated status: '$finalStatus'\n";
