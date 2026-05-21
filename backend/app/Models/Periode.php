<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periodes';
    protected $primaryKey = 'kode_periode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_periode',
        'nama_periode',
        'mulai_daftar',
        'batas_daftar',
        'tgl_ujian',
        'tgl_wawancara',
        'tgl_tes_kesehatan',
    ];

    protected $casts = [
        'mulai_daftar' => 'date',
        'batas_daftar' => 'date',
        'tgl_ujian' => 'date',
        'tgl_wawancara' => 'date',
        'tgl_tes_kesehatan' => 'date',
    ];
}
