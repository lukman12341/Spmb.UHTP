<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Registration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|unique:registrations|max:20',
            'program_studi' => 'required|string|max:255',
            'email' => 'required|string|email|unique:registrations|max:255',
            'no_hp' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'gelombang' => 'required|string|max:50',
            'sumber_informasi' => 'required|string|max:255',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        $registration = Registration::create($validatedData);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'data' => $registration
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        // 1. Check for Admin Login First
        if (($request->email === 'admin@spmb.com' || $request->email === 'admin123') && $request->password === 'admin123') {
            return response()->json([
                'name' => 'Administrator',
                'email' => 'admin@spmb.com',
                'role' => 'admin'
            ]);
        }

        // 2. Check for Participant Login
        $user = Registration::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        // Add participant role for clarity on frontend
        $userArray = $user->toArray();
        $userArray['role'] = 'participant';

        return response()->json($userArray);
    }

    public function resetPassword($id)
    {
        $user = Registration::findOrFail($id);
        $user->update([
            'password' => Hash::make('uhtp12345') // Default password
        ]);

        return response()->json(['message' => 'Password berhasil diriset menjadi: uhtp12345']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'nik' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $user = Registration::where('email', $request->email)
                            ->where('nik', $request->nik)
                            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email atau NIK tidak terdaftar/tidak cocok.'
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Password Anda berhasil diperbarui! Silakan login.']);
    }
}
