<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentConfirmation extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal_bayar',
        'kode_pembayaran',
        'nama_penyetor',
        'jumlah_bayar',
        'bukti_path',
        'status',
    ];
}
