<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdminKesehatan;
use App\Models\Registration;
use App\Models\Biodata;
use App\Models\ExamResult;
use App\Models\HealthTest;
use App\Models\Periode;
use App\Models\Prodi;

class AdminKesehatanController extends Controller
{
    public function getOptions()
    {
        $gelombang = Periode::orderBy('kode_periode')->pluck('kode_periode');
        if ($gelombang->isEmpty()) {
            $gelombang = Registration::whereNotNull('gelombang')->distinct()->orderBy('gelombang')->pluck('gelombang');
        }

        $prodiDb = Prodi::orderBy('nama_prodi')->pluck('nama_prodi')->toArray();
        $prodiReg = Registration::whereNotNull('program_studi')->distinct()->pluck('program_studi')->toArray();
        $prodi = collect(array_merge($prodiDb, $prodiReg))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        $periode = Periode::pluck('kode_periode')
            ->merge(Registration::whereNotNull('gelombang')->distinct()->pluck('gelombang'))
            ->map(fn ($kode) => substr((string) $kode, 0, 4))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return response()->json([
            'status' => 'success',
            'gelombang' => $gelombang,
            'prodi' => $prodi,
            'periode' => $periode
        ]);
    }

    public function index(Request $request)
    {
        $query = Registration::with(['biodata', 'examResult', 'healthTest', 'interviewAnswers.soal'])
            ->whereHas('biodata', function ($q) {
                // Hanya mahasiswa yang sudah difinalisasi (memiliki no ujian)
                $q->whereNotNull('exam_number');
            });

        if ($request->has('gelombang') && $request->gelombang != '') {
            $query->where('gelombang', $request->gelombang);
        }

        if ($request->has('prodi') && $request->prodi != '') {
            $prodi = $request->prodi;
            $prodiLower = strtolower($prodi);
            
            if ($prodiLower === 'si' || strpos($prodiLower, 'sistem informasi') !== false) {
                $query->where(function ($q) {
                    $q->where('program_studi', 'LIKE', '% SI %')
                      ->orWhere('program_studi', 'LIKE', 'SI %')
                      ->orWhere('program_studi', 'LIKE', '% SI')
                      ->orWhere('program_studi', '=', 'SI')
                      ->orWhere('program_studi', 'LIKE', '%Sistem Informasi%');
                });
            } elseif ($prodiLower === 'ti' || strpos($prodiLower, 'teknik informatika') !== false) {
                $query->where(function ($q) {
                    $q->where('program_studi', 'LIKE', '% TI %')
                      ->orWhere('program_studi', 'LIKE', 'TI %')
                      ->orWhere('program_studi', 'LIKE', '% TI')
                      ->orWhere('program_studi', '=', 'TI')
                      ->orWhere('program_studi', 'LIKE', '%Teknik Informatika%');
                });
            } else {
                $query->where('program_studi', 'LIKE', '%' . $prodi . '%');
            }
        }

        if ($request->has('tpa_only') && $request->tpa_only == '1') {
            $query->whereHas('examResult', function ($q) {
                $q->whereNotNull('total_score');
            });
        }

        if ($request->has('kesehatan_only') && $request->kesehatan_only == '1') {
            $query->whereHas('healthTest');
        }

        $registrations = $query->get();

        if ($request->has('filter_health_test') && $request->filter_health_test == '1') {
            $registrations = $registrations->filter(function ($reg) {
                return $this->checkHasKesehatan($reg->program_studi);
            })->values();
        }

        $data = $registrations->map(function ($reg) {
            $hasKesehatan = $this->checkHasKesehatan($reg->program_studi);
            
            // Logic for Final Status
            $status_kesehatan = $reg->healthTest->status_kesehatan ?? null;
            $hasil_wawancara = $reg->biodata->hasil_wawancara ?? null;
            $status_cbt = $reg->examResult->status_kelulusan ?? null;

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
                'Lulus Di S1 Ilmu Komunikasi',
                'Lulus Di S1 Ilmu Hukum',
                'Lulus Di S1 Sistem Informasi',
                'Lulus Di S1 Teknik Informatika',
                'Lulus Di S2 Kesehatan Masyarakat',
                'Lulus Di D3 Rekam Medis & Informasi Kesehatan (RMIK)',
                'Lulus Di D4 Manajemen Informasi Kesehatan (MIK)',
                'Lulus Di D3 Kebidanan',
                'S1 Kesmas Jalur A Reguler', 
                'S1 Kesmas Jalur B (Transfer)',
                'S1 Keperawatan',
                'Profesi Ners',
                'S1 Kebidanan',
                'Profesi Bidan'
            ];

            $isManualApproval = ($reg->examResult->keterangan ?? '') === 'Update Status Manual oleh Admin';
            $isLulusDi = strpos($status_cbt, 'Lulus Di') === 0;
            if ($status_cbt && ($isManualApproval || $isLulusDi || in_array($status_cbt, $manualStatuses))) {
                $finalStatus = $status_cbt;
            } else {
                $finalStatus = 'Proses';
            }

            $details = $reg->examResult->details ?? null;
            $jumlah_benar = '-';
            $skor = null;

            if (is_array($details) && count($details) > 0) {
                $benarCount = 0;
                $salahCount = 0;
                foreach ($details as $detail) {
                    $status = $detail['status'] ?? '';
                    if ($status === 'Betul') {
                        $benarCount++;
                    } else {
                        $salahCount++;
                    }
                }
                $jumlah_benar = $benarCount;
                $total_soal = $benarCount + $salahCount;
                $skor = $total_soal > 0 ? round(($benarCount / $total_soal) * 100) : 0;
            } else {
                if ($reg->examResult) {
                    $jumlah_benar = $reg->examResult->total_score ?? '-';
                    $skor = $reg->examResult->total_score ?? null;
                }
            }

            return [
                'id' => $reg->id,
                'nama' => $reg->name,
                'no_ujian' => $reg->biodata->exam_number ?? '-',
                'pilihan' => $reg->program_studi,
                'gelombang' => $reg->gelombang,
                'status_kesehatan' => $status_kesehatan,
                'skor' => $skor,
                'jumlah_benar' => $jumlah_benar,
                'no_telp' => $reg->no_hp ?? '-',
                'hasil_wawancara' => $hasil_wawancara ?? (\App\Models\InterviewAnswer::where('registration_id', $reg->id)->exists() ? 'SUDAH UJIAN' : 'BELUM UJIAN'),
                'pewawancara' => $reg->biodata->pewawancara ?? null,
                'catatan_wawancara' => $reg->biodata->catatan_wawancara ?? null,
                'status' => $finalStatus,
                'status_registrasi' => $reg->biodata->status_registrasi ?? 'Belum Registrasi',
                'tinggi_badan' => $reg->healthTest->tinggi_badan ?? '',
                'golongan_darah' => $reg->healthTest->golongan_darah ?? '',
                'buta_warna' => $reg->healthTest->buta_warna ?? '',
                'visus' => $reg->healthTest->visus ?? '',
                'tekanan_darah' => $reg->healthTest->tekanan_darah ?? '',
                'riwayat_penyakit' => $reg->healthTest->riwayat_penyakit ?? '',
                'keterangan_kesehatan' => $reg->healthTest->keterangan_kesehatan ?? '',
                'bukti_kesehatan_path' => $reg->healthTest->bukti_kesehatan_path ?? null,
                'details' => $reg->examResult->details ?? [],
                'interview_answers' => $reg->interviewAnswers->map(function ($ans) {
                    return [
                        'id' => $ans->id,
                        'soal_id' => $ans->soal_id,
                        'pertanyaan' => $ans->soal->pertanyaan ?? 'Pertanyaan tidak ditemukan',
                        'jawaban' => $ans->jawaban,
                    ];
                })->toArray(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function updateKelulusan(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'no_hp' => 'nullable|string',
        ]);

        $registration = Registration::findOrFail($id);

        if ($request->has('no_hp')) {
            $registration->no_hp = $request->no_hp;
            $registration->save();
        }

        ExamResult::updateOrCreate(
            ['registration_id' => $id],
            [
                'status_kelulusan' => $request->status,
                'kode_periode' => $registration->gelombang ?? '-',
                'keterangan' => 'Update Status Manual oleh Admin'
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Status kelulusan berhasil diperbarui'
        ]);
    }

    public function updateSkor(Request $request)
    {
        $request->validate([
            'no_ujian' => 'required|string',
            'skor' => 'required|numeric',
            'details' => 'nullable|array'
        ]);

        $no_ujian = $this->normalizeExamNumber($request->no_ujian);
        $biodata = Biodata::where('exam_number', $no_ujian)->first();

        if (!$biodata) {
            return response()->json(['status' => 'error', 'message' => 'Mahasiswa tidak ditemukan'], 404);
        }

        ExamResult::updateOrCreate(
            ['registration_id' => $biodata->registration_id],
            [
                'total_score' => $request->skor,
                'kode_periode' => $biodata->registration->gelombang ?? '-',
                'status_kelulusan' => $request->skor >= 1 ? 'Lulus' : 'Tidak Lulus',
                'keterangan' => 'Hasil Ujian CBT Online',
                'details' => $request->details
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Skor berhasil disimpan'
        ]);
    }

    public function resetUjian(Request $request)
    {
        $request->validate([
            'no_ujian' => 'required|string'
        ]);

        $no_ujian = $this->normalizeExamNumber($request->no_ujian);
        $biodata = Biodata::where('exam_number', $no_ujian)->first();

        if ($biodata) {
            ExamResult::where('registration_id', $biodata->registration_id)->delete();
            return response()->json(['status' => 'success', 'message' => 'Ujian berhasil di-reset']);
        }

        return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);
    }

    public function checkStatus($no_ujian)
    {
        $no_ujian_norm = $this->normalizeExamNumber($no_ujian);
        $biodata = Biodata::where('exam_number', $no_ujian_norm)->first();

        if (!$biodata) {
            return response()->json(['is_finished' => false]);
        }

        $result = ExamResult::where('registration_id', $biodata->registration_id)->first();
        $health = HealthTest::where('registration_id', $biodata->registration_id)->first();

        $status_cbt = $result->status_kelulusan ?? null;
        $status_kesehatan = $health->status_kesehatan ?? null;
        $hasil_wawancara = $biodata->hasil_wawancara ?? null;
        $manualStatuses = [
            'Cadangan', 
            'Lulus Di S1 Kesmas Jalur A Reguler', 
            'Lulus Di S1 Kesmas Jalur B (Transfer)',
            'Lulus Di S1 Keperawatan',
            'Lulus Di Profesi Ners',
            'Lulus Di S1 Kebidanan',
            'Lulus Di Profesi Bidan',
            'Lulus Di S1 Ilmu Komunikasi',
            'Lulus Di S1 Ilmu Hukum',
            'Lulus Di S1 Sistem Informasi',
            'Lulus Di S1 Teknik Informatika',
            'Lulus Di S2 Kesehatan Masyarakat',
            'Lulus Di D3 Rekam Medis & Informasi Kesehatan (RMIK)',
            'Lulus Di D4 Manajemen Informasi Kesehatan (MIK)',
            'Lulus Di D3 Kebidanan',
            'S1 Kesmas Jalur A Reguler', 
            'S1 Kesmas Jalur B (Transfer)',
            'S1 Keperawatan',
            'Profesi Ners',
            'S1 Kebidanan',
            'Profesi Bidan'
        ];
        $isManualApproval = ($result->keterangan ?? '') === 'Update Status Manual oleh Admin';
        $isLulusDi = strpos($status_cbt, 'Lulus Di') === 0;

        $finalStatus = 'Proses';
        if ($status_cbt && ($isManualApproval || $isLulusDi || in_array($status_cbt, $manualStatuses))) {
            $finalStatus = $status_cbt;
        } else {
            $finalStatus = 'Proses';
        }

        return response()->json([
            'is_finished' => $result ? true : false,
            'skor' => $result->total_score ?? null,
            'details' => $result->details ?? [],
            'status_kesehatan' => $health->status_kesehatan ?? null,
            'gelombang' => $biodata->registration->gelombang ?? null,
            'hasil_wawancara' => $biodata->hasil_wawancara ?? (\App\Models\InterviewAnswer::where('registration_id', $biodata->registration_id)->exists() ? 'SUDAH UJIAN' : 'BELUM UJIAN'),
            'status_registrasi' => $biodata->status_registrasi ?? 'Belum Registrasi',
            'bukti_registrasi_path' => $biodata->bukti_registrasi_path ?? null,
            'pas_photo_path' => $biodata->pas_photo_path ?? null,
            'nama_peserta' => $biodata->registration->name ?? null,
            'program_studi' => $biodata->registration->program_studi ?? null,
            'tempat_lahir' => $biodata->tempat_lahir ?? '-',
            'tanggal_lahir' => $biodata->tanggal_lahir ?? '-',
            'nisn' => $biodata->nisn ?? '-',
            'status_kelulusan' => $finalStatus
        ]);
    }

    public function storeWawancaraAnswers(Request $request)
    {
        $request->validate([
            'no_ujian' => 'required|string',
            'answers' => 'required|array',
        ]);

        $no_ujian = $this->normalizeExamNumber($request->no_ujian);
        $biodata = Biodata::where('exam_number', $no_ujian)->first();

        if (!$biodata) {
            return response()->json(['status' => 'error', 'message' => 'Mahasiswa tidak ditemukan'], 404);
        }

        foreach ($request->answers as $soalId => $jawaban) {
            \App\Models\InterviewAnswer::updateOrCreate(
                [
                    'registration_id' => $biodata->registration_id,
                    'soal_id' => $soalId
                ],
                ['jawaban' => $jawaban]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Jawaban wawancara berhasil disimpan'
        ]);
    }

    public function storeKesehatan(Request $request)
    {
        $request->validate([
            'no_ujian' => 'required|string',
            'tinggi_badan' => 'required',
            'golongan_darah' => 'required',
            'buta_warna' => 'required',
            'visus' => 'nullable',
            'tekanan_darah' => 'required',
            'riwayat_penyakit' => 'nullable',
            'bukti_kesehatan' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120'
        ]);

        $no_ujian = $this->normalizeExamNumber($request->no_ujian);
        $biodata = Biodata::where('exam_number', $no_ujian)->first();

        if (!$biodata) {
            return response()->json(['status' => 'error', 'message' => 'Mahasiswa tidak ditemukan'], 404);
        }

        $data = [
            'registration_id' => $biodata->registration_id,
            'tinggi_badan' => $request->tinggi_badan,
            'golongan_darah' => $request->golongan_darah,
            'buta_warna' => $request->buta_warna,
            'visus' => $request->visus,
            'tekanan_darah' => $request->tekanan_darah,
            'riwayat_penyakit' => $request->riwayat_penyakit,
            'status_kesehatan' => 'Menunggu',
        ];

        if ($request->hasFile('bukti_kesehatan')) {
            $file = $request->file('bukti_kesehatan');
            $fileData = file_get_contents($file->getRealPath());
            $mimeType = $file->getMimeType();
            $base64 = base64_encode($fileData);
            $data['bukti_kesehatan_path'] = 'data:' . $mimeType . ';base64,' . $base64;
        }

        HealthTest::updateOrCreate(
            ['registration_id' => $biodata->registration_id],
            $data
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Data kesehatan berhasil disimpan'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);
        
        HealthTest::updateOrCreate(
            ['registration_id' => $id],
            [
                'status_kesehatan' => $request->status_kesehatan === 'null' ? null : $request->status_kesehatan,
                'tinggi_badan' => $request->tinggi_badan,
                'golongan_darah' => $request->golongan_darah,
                'buta_warna' => $request->buta_warna,
                'visus' => $request->visus,
                'tekanan_darah' => $request->tekanan_darah,
                'riwayat_penyakit' => $request->riwayat_penyakit,
                'keterangan_kesehatan' => $request->keterangan_kesehatan,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Data kesehatan berhasil diupdate'
        ]);
    }
    public function updateWawancara(Request $request, $id)
    {
        $biodata = Biodata::where('registration_id', $id)->first();
        if (!$biodata) {
            return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);
        }

        $biodata->update([
            'hasil_wawancara' => $request->hasil_wawancara,
            'pewawancara' => $request->pewawancara,
            'catatan_wawancara' => $request->catatan_wawancara,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hasil wawancara berhasil diupdate'
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

    private function checkHasWawancara($prodi)
    {
        if (!$prodi) return false;
        $lower = strtolower($prodi);
        $allowedWawancaraProdi = [
            's2 kesmas',
            's1 keperawatan',
            'profesi ners',
            's1 kebidanan',
            'profesi bidan'
        ];
        foreach ($allowedWawancaraProdi as $wProdi) {
            if (strpos($lower, $wProdi) !== false) {
                return true;
            }
        }
        return false;
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
