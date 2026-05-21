<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    protected $table = 'prodis';
    protected $primaryKey = 'kode_prodi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_prodi',
        'nama_prodi',
    ];
}
