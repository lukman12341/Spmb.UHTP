<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $table = 'programs';
    protected $primaryKey = 'kode_program';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_program',
        'nama_program',
    ];
}
