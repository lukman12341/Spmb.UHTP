<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalUjian extends Model
{
    protected $fillable = [
        'gelombang',
        'tanggal_ujian',
        'jam_mulai',
        'jam_berakhir',
        'tanggal_registrasi_mulai',
        'tanggal_registrasi_akhir',
    ];
}
