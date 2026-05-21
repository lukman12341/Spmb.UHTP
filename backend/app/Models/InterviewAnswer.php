<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewAnswer extends Model
{
    protected $fillable = [
        'registration_id',
        'soal_id',
        'jawaban'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class, 'soal_id');
    }
}
