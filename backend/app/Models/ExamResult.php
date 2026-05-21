<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    protected $fillable = [
        'registration_id',
        'kode_periode',
        'total_score',
        'status_kelulusan',
        'keterangan',
        'details'
    ];

    protected $casts = [
        'details' => 'array'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
