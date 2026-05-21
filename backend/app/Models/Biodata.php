<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    protected $fillable = [
        'registration_id',
        'nisn', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'alamat', 'kabupaten', 'provinsi', 'no_telp', 'no_hp',
        'nama_sekolah', 'jurusan', 'tahun_tamat', 'nilai', 'alamat_sekolah', 'kabupaten_sekolah', 'provinsi_sekolah',
        'nama_ayah', 'pekerjaan_ayah', 'no_hp_ayah', 'nama_ibu', 'pekerjaan_ibu', 'no_hp_ibu', 'alamat_orang_tua', 'kabupaten_orang_tua', 'provinsi_orang_tua',
        'pas_photo_path', 'ktp_path', 'ijazah_path', 'transkrip_path',
        'is_finalized', 'exam_number', 'status_kesehatan',
        'tinggi_badan', 'golongan_darah', 'buta_warna', 'visus', 'tekanan_darah', 'riwayat_penyakit', 'keterangan_kesehatan', 'bukti_kesehatan_path',
        'hasil_wawancara', 'pewawancara', 'catatan_wawancara',
        'bukti_registrasi_path', 'status_registrasi'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
