<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Biodata;
use App\Models\Registration;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BiodataController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'registration_id' => 'required|exists:registrations,id',
            'pas_photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'ktp' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'ijazah' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'transkrip' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['pas_photo', 'ktp', 'ijazah', 'transkrip']);
        
        $biodata = Biodata::updateOrCreate(
            ['registration_id' => $request->registration_id],
            $data
        );

        // Handle File Uploads
        $fileFields = ['pas_photo', 'ktp', 'ijazah', 'transkrip'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                $oldPathField = $field . '_path';
                if ($biodata->$oldPathField) {
                    Storage::disk('public')->delete($biodata->$oldPathField);
                }

                $file = $request->file($field);
                $path = $file->store('biodata_files', 'public');
                $biodata->$oldPathField = $path;
            }
        }

        $biodata->save();

        return response()->json([
            'message' => 'Biodata berhasil disimpan!',
            'data' => $biodata
        ]);
    }

    public function show($registration_id)
    {
        $biodata = Biodata::where('registration_id', $registration_id)->first();
        if (!$biodata) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        return response()->json($biodata);
    }

    public function finalize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'registration_id' => 'required|exists:registrations,id',
            'exam_number' => 'required|string|unique:biodatas,exam_number',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $biodata = Biodata::where('registration_id', $request->registration_id)->first();
        if (!$biodata) {
            return response()->json(['message' => 'Lengkapi biodata terlebih dahulu'], 404);
        }

        $biodata->is_finalized = true;
        $biodata->exam_number = $request->exam_number;
        $biodata->save();

        return response()->json([
            'message' => 'Data berhasil difinalisasi!',
            'data' => $biodata
        ]);
    }

    public function index()
    {
        // Ambil semua registrasi beserta relasi biodata, healthTest, dan examResult-nya
        $registrations = Registration::with(['biodata', 'healthTest', 'examResult'])->get();
        
        $mapped = $registrations->map(function (Registration $r) {
            $b = $r->biodata;
            $health = $r->healthTest;
            $hasKesehatan = $this->checkHasKesehatan($r->program_studi);
            
            // Logic for Final Status
            $status_kesehatan = $health->status_kesehatan ?? null;
            $hasil_wawancara = $b->hasil_wawancara ?? null;
            $status_cbt = $r->examResult->status_kelulusan ?? null;

            $isHealthFailed = $hasKesehatan && ($status_kesehatan && !in_array($status_kesehatan, ['Sehat', 'Lulus', 'Menunggu']));
            
            $finalStatus = 'Proses';

            // List of manual statuses that should override the automatic logic
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

            $isManualApproval = ($r->examResult->keterangan ?? '') === 'Update Status Manual oleh Admin';
            if ($status_cbt && ($isManualApproval || in_array($status_cbt, $manualStatuses))) {
                $finalStatus = $status_cbt;
            } else {
                $finalStatus = 'Proses';
            }

            // Jika biodata ada, gunakan array-nya, jika tidak buat array default
            $biodataData = $b ? array_merge($b->toArray(), [
                'status_registrasi' => $b->status_registrasi ?? 'Belum Registrasi'
            ]) : [
                'id' => null,
                'registration_id' => $r->id,
                'nisn' => null,
                'tempat_lahir' => null,
                'tanggal_lahir' => null,
                'jenis_kelamin' => null,
                'agama' => null,
                'is_finalized' => false,
                'exam_number' => null,
                'pas_photo_path' => null,
                'status_registrasi' => 'Belum Registrasi',
                'bukti_registrasi_path' => null,
            ];

            return array_merge($biodataData, [
                'registration' => $r->toArray(),
                'status_kesehatan' => $status_kesehatan,
                'status' => $finalStatus,
                'tinggi_badan' => $health->tinggi_badan ?? null,
                'golongan_darah' => $health->golongan_darah ?? null,
                'buta_warna' => $health->buta_warna ?? null,
                'visus' => $health->visus ?? null,
                'tekanan_darah' => $health->tekanan_darah ?? null,
                'riwayat_penyakit' => $health->riwayat_penyakit ?? null,
                'keterangan_kesehatan' => $health->keterangan_kesehatan ?? null,
                'bukti_kesehatan_path' => $health->bukti_kesehatan_path ?? null,
            ]);
        });

        return response()->json($mapped);
    }

    public function reject($id)
    {
        $biodata = Biodata::findOrFail($id);
        $biodata->update([
            'is_finalized' => false,
            'exam_number' => null
        ]);

        return response()->json(['message' => 'Status finalisasi berhasil dibatalkan.']);
    }

    public function storeRegistrasi(Request $request)
    {
        if ($request->has('no_ujian')) {
            $request->merge(['no_ujian' => $this->normalizeExamNumber($request->no_ujian)]);
        }

        $validator = Validator::make($request->all(), [
            'no_ujian' => 'required|exists:biodatas,exam_number',
            'bukti_registrasi' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $biodata = Biodata::where('exam_number', $request->no_ujian)->first();
        
        if ($request->hasFile('bukti_registrasi')) {
            if ($biodata->bukti_registrasi_path) {
                Storage::disk('public')->delete($biodata->bukti_registrasi_path);
            }

            $file = $request->file('bukti_registrasi');
            $path = $file->store('registration_files', 'public');
            $biodata->bukti_registrasi_path = $path;
            $biodata->status_registrasi = 'Menunggu Verifikasi';
            $biodata->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Bukti registrasi berhasil diupload, menunggu verifikasi admin.',
            'data' => $biodata
        ]);
    }

    public function verifyRegistrasi(Request $request, $id)
    {
        $biodata = Biodata::findOrFail($id);
        $biodata->status_registrasi = $request->status; 
        $biodata->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status registrasi berhasil diupdate.'
        ]);
    }

    private function checkHasKesehatan($prodi)
    {
        if (!$prodi) return false;
        $lower = strtolower($prodi);
        
        $isS1Kesmas = (strpos($lower, 's1') !== false) && (strpos($lower, 'kesmas') !== false || strpos($lower, 'kesehatan masyarakat') !== false || strpos($lower, 'ikm') !== false);
        $isS1Bidan = (strpos($lower, 's1') !== false) && (strpos($lower, 'bidan') !== false || strpos($lower, 'kebidanan') !== false);
        $isS1Keperawatan = (strpos($lower, 's1') !== false) && (strpos($lower, 'keperawatan') !== false || strpos($lower, 'kperwatan') !== false || strpos($lower, 'kpr') !== false);
        $isD3Rmik = (strpos($lower, 'd3') !== false) && (strpos($lower, 'rmik') !== false || strpos($lower, 'rekam medis') !== false || strpos($lower, 'perekam medis') !== false || strpos($lower, 'mik') !== false);
        $isD4Rmik = (strpos($lower, 'd4') !== false) && (strpos($lower, 'rmik') !== false || strpos($lower, 'mik') !== false || strpos($lower, 'rekam medis') !== false || strpos($lower, 'perekam medis') !== false || strpos($lower, 'manajemen informasi kesehatan') !== false);
        $isProfesiNers = (strpos($lower, 'profesi') !== false) && (strpos($lower, 'ners') !== false);
        $isProfesiBidan = (strpos($lower, 'profesi') !== false) && (strpos($lower, 'bidan') !== false || strpos($lower, 'kebidanan') !== false);
        
        return $isS1Kesmas || $isS1Bidan || $isS1Keperawatan || $isD3Rmik || $isD4Rmik || $isProfesiNers || $isProfesiBidan;
    }

    private function normalizeExamNumber($examNumber)
    {
        $val = strtoupper(trim($examNumber));
        if (strlen($val) === 12) {
            $chars = str_split($val);
            if ($chars[5] === '0') {
                $chars[5] = 'O';
            }
            if ($chars[6] === '0') {
                $chars[6] = 'O';
            }
            for ($i = 0; $i < 5; $i++) {
                if ($chars[$i] === 'O') {
                    $chars[$i] = '0';
                }
            }
            for ($i = 8; $i < 12; $i++) {
                if ($chars[$i] === 'O') {
                    $chars[$i] = '0';
                }
            }
            $val = implode('', $chars);
        }
        return $val;
    }
}
