<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formulir extends Model
{
    use HasFactory;

    protected $table = 'formulirs';
    protected $primaryKey = 'kode_formulir';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_formulir',
        'kode_prodi',
        'kode_program',
        'nama_formulir',
        'harga',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function program()
    {
        return $this->belongsTo(Program::class, 'kode_program', 'kode_program');
    }
}
