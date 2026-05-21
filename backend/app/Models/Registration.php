<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nik',
        'program_studi',
        'email',
        'no_hp',
        'password',
        'gelombang',
        'sumber_informasi',
    ];

    protected $hidden = [
        'password',
    ];

    public function biodata()
    {
        return $this->hasOne(Biodata::class);
    }

    public function examResult()
    {
        return $this->hasOne(ExamResult::class);
    }

    public function healthTest()
    {
        return $this->hasOne(HealthTest::class);
    }

    public function interviewAnswers()
    {
        return $this->hasMany(InterviewAnswer::class);
    }
}
