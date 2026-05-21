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

        $prodi = Prodi::orderBy('nama_prodi')->pluck('nama_prodi');
        if ($prodi->isEmpty()) {
            $prodi = Registration::whereNotNull('program_studi')->distinct()->orderBy('program_studi')->pluck('program_studi');
        }

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
        $query = Registration::with(['biodata', 'examResult', 'healthTest'])
            ->whereHas('biodata', function ($q) {
                // Hanya mahasiswa yang sudah difinalisasi (memiliki no ujian)
                $q->whereNotNull('exam_number');
            });

        if ($request->has('gelombang') && $request->gelombang != '') {
            $query->where('gelombang', $request->gelombang);
        }

        if ($request->has('prodi') && $request->prodi != '') {
            $query->where('program_studi', 'LIKE', '%' . $request->prodi . '%');
        }

        $registrations = $query->get();

        $data = $registrations->map(function ($reg) {
            $isS2Kesmas = stripos($reg->program_studi, 'kesmas') !== false;
            
            // Logic for Final Status
            $status_kesehatan = $reg->healthTest->status_kesehatan ?? null;
            $hasil_wawancara = $reg->biodata->hasil_wawancara ?? null;
            $status_cbt = $reg->examResult->status_kelulusan ?? null;

            $isHealthFailed = ($status_kesehatan && !in_array($status_kesehatan, ['Sehat', 'Lulus', 'Menunggu']));
            
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

            if ($status_cbt && in_array($status_cbt, $manualStatuses)) {
                $finalStatus = $status_cbt;
            } elseif ($isHealthFailed) {
                $finalStatus = 'Tidak Lulus';
            } elseif ($status_cbt === 'Lulus' && ($isS2Kesmas || in_array($status_kesehatan, ['Sehat', 'Lulus'])) && (!$hasil_wawancara || $hasil_wawancara === 'LULUS')) {
                // If it requires interview but hasil is null, it's still 'Proses'
                if (!$isS2Kesmas && in_array(strtolower($reg->program_studi), ['profesi ners', 's1 keperawatan', 's1 kebidanan', 'profesi bidan'])) {
                    $finalStatus = $hasil_wawancara === 'LULUS' ? 'Lulus' : 'Proses';
                } else {
                    $finalStatus = 'Lulus';
                }
            } elseif ($status_cbt === 'Tidak Lulus' || $hasil_wawancara === 'TIDAK LULUS') {
                $finalStatus = 'Tidak Lulus';
            }

            return [
                'id' => $reg->id,
                'nama' => $reg->name,
                'no_ujian' => $reg->biodata->exam_number ?? '-',
                'pilihan' => $reg->program_studi,
                'gelombang' => $reg->gelombang,
                'status_kesehatan' => $status_kesehatan,
                'skor' => $reg->examResult->total_score ?? null,
                'jumlah_benar' => $reg->examResult->total_score ?? '-',
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
                'details' => $reg->examResult->details ?? []
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

        $biodata = Biodata::where('exam_number', $request->no_ujian)->first();

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

        $biodata = Biodata::where('exam_number', $request->no_ujian)->first();

        if ($biodata) {
            ExamResult::where('registration_id', $biodata->registration_id)->delete();
            return response()->json(['status' => 'success', 'message' => 'Ujian berhasil di-reset']);
        }

        return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);
    }

    public function checkStatus($no_ujian)
    {
        $biodata = Biodata::where('exam_number', $no_ujian)->first();

        if (!$biodata) {
            return response()->json(['is_finished' => false]);
        }

        $result = ExamResult::where('registration_id', $biodata->registration_id)->first();
        $health = HealthTest::where('registration_id', $biodata->registration_id)->first();

        return response()->json([
            'is_finished' => $result ? true : false,
            'skor' => $result->total_score ?? null,
            'details' => $result->details ?? [],
            'status_kesehatan' => $health->status_kesehatan ?? null,
            'gelombang' => $biodata->registration->gelombang ?? null,
            'hasil_wawancara' => $biodata->hasil_wawancara ?? (\App\Models\InterviewAnswer::where('registration_id', $biodata->registration_id)->exists() ? 'SUDAH UJIAN' : 'BELUM UJIAN'),
            'status_registrasi' => $biodata->status_registrasi ?? 'Belum Registrasi',
            'bukti_registrasi_path' => $biodata->bukti_registrasi_path ?? null,
            'nama_peserta' => $biodata->registration->name ?? null,
            'program_studi' => $biodata->registration->program_studi ?? null,
            'tempat_lahir' => $biodata->tempat_lahir ?? '-',
            'tanggal_lahir' => $biodata->tanggal_lahir ?? '-',
            'nisn' => $biodata->nisn ?? '-'
        ]);
    }

    public function storeWawancaraAnswers(Request $request)
    {
        $request->validate([
            'no_ujian' => 'required|string',
            'answers' => 'required|array',
        ]);

        $biodata = Biodata::where('exam_number', $request->no_ujian)->first();

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

        $biodata = Biodata::where('exam_number', $request->no_ujian)->first();

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
            $path = $request->file('bukti_kesehatan')->store('bukti_kesehatan', 'public');
            $data['bukti_kesehatan_path'] = $path;
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
}
