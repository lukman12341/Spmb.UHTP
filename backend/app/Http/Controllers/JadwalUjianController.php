<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JadwalUjianController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\JadwalUjian::orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gelombang' => 'required|string',
            'tanggal_ujian' => 'required|date',
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'tanggal_registrasi_mulai' => 'required|date',
            'tanggal_registrasi_akhir' => 'required|date',
        ]);

        $jadwal = \App\Models\JadwalUjian::create($validated);
        return response()->json($jadwal);
    }

    public function update(Request $request, $id)
    {
        $jadwal = \App\Models\JadwalUjian::findOrFail($id);
        $validated = $request->validate([
            'gelombang' => 'required|string',
            'tanggal_ujian' => 'required|date',
            'jam_mulai' => 'required',
            'jam_berakhir' => 'required',
            'tanggal_registrasi_mulai' => 'required|date',
            'tanggal_registrasi_akhir' => 'required|date',
        ]);

        $jadwal->update($validated);
        return response()->json($jadwal);
    }

    public function destroy($id)
    {
        $jadwal = \App\Models\JadwalUjian::findOrFail($id);
        $jadwal->delete();
        return response()->json(['message' => 'Jadwal berhasil dihapus']);
    }
}
