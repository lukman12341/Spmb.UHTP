<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentConfirmation;
use Illuminate\Support\Facades\Cache;

class AdminPaymentController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required'
        ]);

        if (($request->email === 'admin@spmb.com' || $request->email === 'admin123') && $request->password === 'admin123') {
            $token = bin2hex(random_bytes(32));
            Cache::put('admin_token_' . $token, true, now()->addHours(8));

            return response()->json([
                'message' => 'Login success',
                'token' => $token,
                'user' => [
                    'name' => 'Administrator',
                    'email' => 'admin@spmb.com'
                ]
            ]);
        }

        return response()->json(['message' => 'Kredensial admin tidak valid'], 401);
    }

    public function index()
    {
        // Ambil semua pembayaran
        $payments = PaymentConfirmation::orderBy('created_at', 'desc')->get();
        
        // Tambahkan data registrasi (termasuk No HP) ke setiap pembayaran
        // Kita mencocokkan ID dari kode_pembayaran (format: GELOMBANG-ID)
        foreach ($payments as $payment) {
            $parts = explode('-', $payment->kode_pembayaran);
            $regId = (count($parts) > 1) ? $parts[1] : null;
            
            if ($regId) {
                $registration = \App\Models\Registration::find($regId);
                if ($registration) {
                    $payment->registration = $registration;
                }
            }
        }
        
        return response()->json($payments);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,verified,rejected'
        ]);

        $payment = PaymentConfirmation::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $payment->status = $request->status;
        $payment->save();

        return response()->json([
            'message' => 'Status berhasil diperbarui',
            'data' => $payment
        ]);
    }
}
