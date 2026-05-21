
<?php

use App\Models\Registration;
use App\Models\Biodata;
use App\Models\ExamResult;
use App\Models\HealthTest;

require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$noUjian = '20264AY-3177';

$biodata = Biodata::where('exam_number', $noUjian)->first();

if (!$biodata) {
    echo "Student with exam number $noUjian not found.\n";
    exit;
}

$regId = $biodata->registration_id;

echo "Resetting data for Student: " . ($biodata->registration->name ?? 'Unknown') . " (ID: $regId)\n";

// 1. Delete Exam Results
ExamResult::where('registration_id', $regId)->delete();
echo "- Exam Results deleted.\n";

// 2. Delete Health Tests
HealthTest::where('registration_id', $regId)->delete();
echo "- Health Tests deleted.\n";

// 3. Clear Biodata fields related to test results and registration
$biodata->update([
    'status_kesehatan' => null,
    'hasil_wawancara' => null,
    'pewawancara' => null,
    'catatan_wawancara' => null,
    'status_registrasi' => 'Belum Registrasi',
    'bukti_registrasi_path' => null,
    'tinggi_badan' => null,
    'golongan_darah' => null,
    'buta_warna' => null,
    'visus' => null,
    'tekanan_darah' => null,
    'riwayat_penyakit' => null,
    'keterangan_kesehatan' => null,
    'bukti_kesehatan_path' => null,
]);
echo "- Biodata fields cleared.\n";

echo "Reset complete.\n";
