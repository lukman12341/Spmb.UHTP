<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Registration;
use App\Models\HealthTest;
use App\Models\Biodata;

function checkHasKesehatan($prodi) {
    if (!$prodi) return false;
    $lower = strtolower($prodi);
    
    $isS1Kesmas = (strpos($lower, 's1') !== false) && (strpos($lower, 'kesmas') !== false || strpos($lower, 'kesehatan masyarakat') !== false || strpos($lower, 'ikm') !== false);
    $isS1Bidan = (strpos($lower, 's1') !== false) && (strpos($lower, 'bidan') !== false || strpos($lower, 'kebidanan') !== false);
    $isS1Keperawatan = (strpos($lower, 's1') !== false) && (strpos($lower, 'keperawatan') !== false || strpos($lower, 'kperwatan') !== false || strpos($lower, 'kpr') !== false);
    $isD3Rmik = (strpos($lower, 'd3') !== false) && (strpos($lower, 'rmik') !== false || strpos($lower, 'rekam medis') !== false || strpos($lower, 'perekam medis') !== false || strpos($lower, 'mik') !== false);
    $isD4Rmik = (strpos($lower, 'd4') !== false) && (strpos($lower, 'rmik') !== false || strpos($lower, 'mik') !== false || strpos($lower, 'rekam medis') !== false || strpos($lower, 'perekam medis') !== false || strpos($lower, 'manajemen informasi kesehatan') !== false);
    
    return $isS1Kesmas || $isS1Bidan || $isS1Keperawatan || $isD3Rmik || $isD4Rmik;
}

$registrations = Registration::all();
$deletedCount = 0;
$biodataClearedCount = 0;

foreach ($registrations as $r) {
    $hasKesehatan = checkHasKesehatan($r->program_studi);
    if (!$hasKesehatan) {
        // 1. Delete record in health_tests table
        $healthTest = HealthTest::where('registration_id', $r->id)->first();
        if ($healthTest) {
            // Delete file if exists
            if ($healthTest->bukti_kesehatan_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($healthTest->bukti_kesehatan_path);
            }
            $healthTest->delete();
            $deletedCount++;
        }
        
        // 2. Also clear health-related columns in biodatas table if they exist
        $biodata = Biodata::where('registration_id', $r->id)->first();
        if ($biodata) {
            $updated = false;
            if ($biodata->status_kesehatan !== null) {
                $biodata->status_kesehatan = null;
                $updated = true;
            }
            if ($biodata->bukti_kesehatan_path !== null) {
                // Delete file if exists
                \Illuminate\Support\Facades\Storage::disk('public')->delete($biodata->bukti_kesehatan_path);
                $biodata->bukti_kesehatan_path = null;
                $updated = true;
            }
            // Clear other health columns if they have values
            $healthFields = ['tinggi_badan', 'golongan_darah', 'buta_warna', 'visus', 'tekanan_darah', 'riwayat_penyakit', 'keterangan_kesehatan'];
            foreach ($healthFields as $field) {
                if (isset($biodata->$field) && $biodata->$field !== null) {
                    $biodata->$field = null;
                    $updated = true;
                }
            }
            if ($updated) {
                $biodata->save();
                $biodataClearedCount++;
            }
        }
    }
}

echo "Database Cleanup Completed:\n";
echo "- Deleted health_tests records: $deletedCount\n";
echo "- Cleared health fields in biodatas: $biodataClearedCount\n";
