<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'tinggi_badan',
        'golongan_darah',
        'buta_warna',
        'visus',
        'tekanan_darah',
        'riwayat_penyakit',
        'status_kesehatan',
        'keterangan_kesehatan',
        'bukti_kesehatan_path'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
