<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PaymentConfirmation;
use Illuminate\Support\Facades\Storage;

class PaymentConfirmationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tanggal_bayar' => 'required|date',
            'kode_pembayaran' => 'required|string',
            'nama_penyetor' => 'required|string',
            'jumlah_bayar' => 'required|string',
            'bukti_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($request->hasFile('bukti_file')) {
            $file = $request->file('bukti_file');
            // Store the file in public/payments directory
            $path = $file->store('payments', 'public');

            $payment = PaymentConfirmation::create([
                'tanggal_bayar' => $request->tanggal_bayar,
                'kode_pembayaran' => $request->kode_pembayaran,
                'nama_penyetor' => $request->nama_penyetor,
                'jumlah_bayar' => $request->jumlah_bayar,
                'bukti_path' => $path,
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diunggah',
                'data' => $payment
            ], 201);
        }

        return response()->json(['message' => 'File tidak ditemukan'], 400);
    }

    public function checkStatus($kode_pembayaran)
    {
        $payment = PaymentConfirmation::where('kode_pembayaran', $kode_pembayaran)
                                      ->orderBy('created_at', 'desc')
                                      ->first();
        
        if ($payment) {
            return response()->json([
                'status' => $payment->status,
                'tanggal_bayar' => $payment->tanggal_bayar
            ]);
        }

        return response()->json(['status' => 'belum_bayar']);
    }
}
