<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prodi;
use App\Models\Program;
use App\Models\Formulir;
use App\Models\Periode;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kosongkan tabel terlebih dahulu untuk menghindari duplikasi saat seeding ulang
        \Schema::disableForeignKeyConstraints();
        Formulir::truncate();
        Program::truncate();
        Prodi::truncate();
        Periode::truncate();
        \Schema::enableForeignKeyConstraints();

        // 1. Data Prodi (Daftar Lengkap 13 Prodi)
        $prodis = [
            ['kode_prodi' => 'S2-IKM', 'nama_prodi' => 'S2 Kesehatan Masyarakat'],
            ['kode_prodi' => 'S1-IKM', 'nama_prodi' => 'S1 Kesehatan Masyarakat'],
            ['kode_prodi' => 'S1-KPR', 'nama_prodi' => 'S1 Keperawatan'],
            ['kode_prodi' => 'PROF-NERS', 'nama_prodi' => 'Profesi Ners'],
            ['kode_prodi' => 'D3-RMIK', 'nama_prodi' => 'D3 Rekam Medis'],
            ['kode_prodi' => 'D3-KEB', 'nama_prodi' => 'D3 Kebidanan'],
            ['kode_prodi' => 'S1-KEB', 'nama_prodi' => 'S1 Kebidanan'],
            ['kode_prodi' => 'PROF-BID', 'nama_prodi' => 'Profesi Bidan'],
            ['kode_prodi' => 'S1-TI', 'nama_prodi' => 'S1 Teknik Informatika'],
            ['kode_prodi' => 'S1-SI', 'nama_prodi' => 'S1 Sistem Informasi'],
            ['kode_prodi' => 'S1-HKM', 'nama_prodi' => 'S1 Ilmu Hukum'],
            ['kode_prodi' => 'S1-IKOM', 'nama_prodi' => 'S1 Ilmu Komunikasi'],
            ['kode_prodi' => 'D4-MIK', 'nama_prodi' => 'D4 Manajemen Informasi Kesehatan'],
        ];
        foreach ($prodis as $p) Prodi::create($p);

        // 2. Data Program (Berdasarkan screenshot pendaftaran Anda)
        $programs = [
            ['kode_program' => 'REG', 'nama_program' => 'Program Reguler'],
            ['kode_program' => 'RPLA1', 'nama_program' => 'Program RPLA1'],
            ['kode_program' => 'RPLA2', 'nama_program' => 'Program RPLA2'],
            ['kode_program' => 'NON-REG', 'nama_program' => 'Program Non-Reguler'],
        ];
        foreach ($programs as $pr) Program::create($pr);

        // 3. Data Formulir (Contoh beberapa kombinasi)
        // Lukman: S1 SI Program Reguler
        // Khairi: S1 Kesmas Program Reguler
        $formulirs = [
            ['kode_formulir' => 'F-SI-REG', 'kode_prodi' => 'S1-SI', 'kode_program' => 'REG', 'nama_formulir' => 'Formulir S1 SI Reguler', 'harga' => 250000],
            ['kode_formulir' => 'F-IKM-REG', 'kode_prodi' => 'S1-IKM', 'kode_program' => 'REG', 'nama_formulir' => 'Formulir S1 Kesmas Reguler', 'harga' => 250000],
            ['kode_formulir' => 'F-IKOM-REG', 'kode_prodi' => 'S1-IKOM', 'kode_program' => 'REG', 'nama_formulir' => 'Formulir S1 Ilmu Komunikasi Reguler', 'harga' => 250000],
            ['kode_formulir' => 'F-KEB-RPLA1', 'kode_prodi' => 'S1-KEB', 'kode_program' => 'RPLA1', 'nama_formulir' => 'Formulir S1 Kebidanan RPLA1', 'harga' => 300000],
        ];
        foreach ($formulirs as $f) Formulir::create($f);

        // 4. Data Periode
        Periode::create([
            'kode_periode' => '20263', // Sesuai pilihan di screenshot Anda
            'nama_periode' => 'Gelombang 3 Tahun 2026',
            'mulai_daftar' => '2026-04-01',
            'batas_daftar' => '2026-08-31',
            'tgl_ujian' => '2026-09-05',
            'tgl_wawancara' => '2026-09-06',
            'tgl_tes_kesehatan' => '2026-09-07',
        ]);
    }
}
