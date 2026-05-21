<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SoalController extends Controller
{
    public function store(Request $request)
    {
        $isWawancara = $request->input('soal_untuk') === 'Soal Wawancara';
        
        $rules = [
            'pertanyaan' => 'required|string',
            'pilihan_a' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_b' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_c' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_d' => $isWawancara ? 'nullable|string' : 'required|string',
            'jawaban' => $isWawancara ? 'nullable|string|max:1' : 'required|string|max:1',
            'type_soal' => 'required|string',
            'soal_untuk' => 'required|string',
            'kategori' => 'nullable|string',
            'prodi' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        try {
            DB::table('soals')->insert([
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_a' => $validated['pilihan_a'] ?? null,
                'pilihan_b' => $validated['pilihan_b'] ?? null,
                'pilihan_c' => $validated['pilihan_c'] ?? null,
                'pilihan_d' => $validated['pilihan_d'] ?? null,
                'jawaban' => $validated['jawaban'] ?? null,
                'type_soal' => $validated['type_soal'],
                'soal_untuk' => $validated['soal_untuk'],
                'kategori' => $validated['kategori'] ?? null,
                'prodi' => $validated['prodi'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Soal berhasil disimpan',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan soal: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $isWawancara = $request->input('soal_untuk') === 'Soal Wawancara';

        $rules = [
            'pertanyaan' => 'required|string',
            'pilihan_a' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_b' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_c' => $isWawancara ? 'nullable|string' : 'required|string',
            'pilihan_d' => $isWawancara ? 'nullable|string' : 'required|string',
            'jawaban' => $isWawancara ? 'nullable|string|max:1' : 'required|string|max:1',
            'type_soal' => 'required|string',
            'soal_untuk' => 'required|string',
            'kategori' => 'nullable|string',
            'prodi' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        try {
            DB::table('soals')->where('id', $id)->update([
                'pertanyaan' => $validated['pertanyaan'],
                'pilihan_a' => $validated['pilihan_a'] ?? null,
                'pilihan_b' => $validated['pilihan_b'] ?? null,
                'pilihan_c' => $validated['pilihan_c'] ?? null,
                'pilihan_d' => $validated['pilihan_d'] ?? null,
                'jawaban' => $validated['jawaban'] ?? null,
                'type_soal' => $validated['type_soal'],
                'soal_untuk' => $validated['soal_untuk'],
                'kategori' => $validated['kategori'] ?? null,
                'prodi' => $validated['prodi'] ?? null,
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Soal berhasil diperbarui',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui soal: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $soal = DB::table('soals')->where('id', $id)->first();
            if (!$soal) {
                return response()->json(['message' => 'Soal tidak ditemukan'], 404);
            }

            $newStatus = $soal->status === 'aktif' ? 'nonaktif' : 'aktif';
            
            DB::table('soals')->where('id', $id)->update([
                'status' => $newStatus,
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Status soal berhasil diubah',
                'status' => $newStatus
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengubah status: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $soal_untuk = $request->query('soal_untuk');
        
        $query = DB::table('soals');
        
        if ($soal_untuk) {
            $query->where('soal_untuk', $soal_untuk);
        }

        if ($request->has('prodi') && $request->prodi != '') {
            $query->where(function($q) use ($request) {
                $prodi = $request->prodi;
                $q->where('prodi', $prodi)
                  ->orWhereNull('prodi')
                  ->orWhere('prodi', '')
                  ->orWhere('prodi', 'LIKE', '%' . $prodi . '%')
                  ->orWhereRaw('? LIKE CONCAT("%", prodi, "%")', [$prodi]);
            });
        }
        
        $soals = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json($soals);
    }
}
