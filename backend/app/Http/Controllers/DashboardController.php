<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\PaymentConfirmation;
use App\Models\Attendance;
use App\Models\Prodi;
use App\Models\Program;
use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $periode = $request->query('periode');

        // 1. Summary Cards
        // Jalur A (Reguler), Jalur B (Beasiswa), Jalur Pascasarjana
        // We assume 'gelombang' or some other field maps to these tracks
        // For now, let's count based on the track name in the 'registrations' table if possible
        // Or we can use the programs table
        
        $stats = [
            [
                'label' => 'Jalur A (Reguler)',
                'value' => Registration::where('program_studi', 'LIKE', '%Reguler%')->count(),
                'color' => 'bg-[#00c0ef]',
                'icon' => 'school'
            ],
            [
                'label' => 'Jalur B (Beasiswa)',
                'value' => Registration::where('program_studi', 'LIKE', '%Beasiswa%')->count(),
                'color' => 'bg-[#00a65a]',
                'icon' => 'workspace_premium'
            ],
            [
                'label' => 'Jalur Pascasarjana',
                'value' => Registration::where('program_studi', 'LIKE', '%Pasca%')->count(),
                'color' => 'bg-[#f39c12]',
                'icon' => 'history_edu'
            ],
            [
                'label' => 'Kehadiran Peserta',
                'value' => Attendance::where('status', 'hadir')->count(),
                'color' => 'bg-[#dd4b39]',
                'icon' => 'group'
            ],
        ];

        // 2. Grafik Pendaftaran (Group by Prodi)
        $pendaftaranData = Registration::select('program_studi as label', DB::raw('count(*) as val'))
            ->groupBy('program_studi')
            ->get()
            ->map(function($item) {
                $item->color = $this->getRandomColor();
                return $item;
            });

        // 3. Grafik Registrasi (Verified Payments)
        // We need to link PaymentConfirmation to Registration
        $verifiedRegIds = PaymentConfirmation::where('status', 'verified')->get()->map(function($payment) {
            $parts = explode('-', $payment->kode_pembayaran);
            return (count($parts) > 1) ? $parts[1] : null;
        })->filter()->toArray();

        $registrasiData = Registration::whereIn('id', $verifiedRegIds)
            ->select('program_studi as label', DB::raw('count(*) as val'))
            ->groupBy('program_studi')
            ->get()
            ->map(function($item) {
                $item->color = $this->getRandomColor();
                return $item;
            });

        // 4. Grafik Sumber Informasi
        $sumberData = Registration::select('sumber_informasi as label', DB::raw('count(*) as val'))
            ->groupBy('sumber_informasi')
            ->get()
            ->map(function($item) {
                $item->color = $this->getRandomColor();
                return $item;
            });

        return response()->json([
            'stats' => $stats,
            'pendaftaranData' => $pendaftaranData,
            'registrasiData' => $registrasiData,
            'sumberData' => $sumberData,
            'totalPendaftaran' => $pendaftaranData->sum('val'),
            'totalRegistrasi' => $registrasiData->sum('val'),
            'totalResponden' => $sumberData->sum('val'),
        ]);
    }

    public function getDetailStats()
    {
        $registrations = Registration::all();
        $verifiedRegIds = PaymentConfirmation::where('status', 'verified')->get()->map(function($payment) {
            $parts = explode('-', $payment->kode_pembayaran);
            return (count($parts) > 1) ? $parts[1] : null;
        })->filter()->toArray();

        // Standardize Prodi Names for mapping
        $standardProdis = [
            'S1 SI' => 'S1 Sistem Informasi',
            'S1 TI' => 'S1 Teknik Informatika',
            'S1 Sistem Informasi' => 'S1 Sistem Informasi',
            'S1 Teknik Informatika' => 'S1 Teknik Informatika',
            'S1 Ilmu Komunikasi' => 'S1 Ilmu Komunikasi',
            'S1 Ilmu Hukum' => 'S1 Ilmu Hukum',
            'Profesi Ners' => 'Profesi Ners',
            'S1 Keperawatan' => 'S1 Keperawatan',
            'S1 Kebidanan' => 'S1 Kebidanan',
            'S2 Kesehatan Masyarakat' => 'S2 Kesehatan Masyarakat',
            'S1 Kesehatan Masyarakat' => 'S1 Kesehatan Masyarakat',
            'Profesi Bidan' => 'Profesi Bidan',
            'D3 Kebidanan' => 'D3 Kebidanan',
            'D3 RMIK' => 'D3 RMIK',
            'D3 Rekam Medis' => 'D3 RMIK',
            'D4 MIK' => 'D4 Manajemen Informasi Kesehatan',
            'D4 Manajemen Informasi Kesehatan' => 'D4 Manajemen Informasi Kesehatan'
        ];

        // Standardize Program Names
        $standardPrograms = [
            'RPLA1' => 'Program RPLA1',
            'RPLA2' => 'Program RPLA2',
            'Beasiswa' => 'Jalur B (Beasiswa)',
            'Pasca' => 'Jalur Pascasarjana',
            'Reguler' => 'Jalur A (Reguler)',
        ];

        $regulerOnlyProdis = [
            'Profesi Bidan',
            'Profesi Ners',
            'D3 Kebidanan',
            'D3 RMIK',
            'D4 Manajemen Informasi Kesehatan',
            'S1 Ilmu Komunikasi',
            'S1 Ilmu Hukum'
        ];

        $facultyMapping = [
            "FAKULTAS KESEHATAN" => [
                "S2 Kesehatan Masyarakat",
                "S1 Kesehatan Masyarakat",
                "S1 Keperawatan",
                "S1 Kebidanan",
                "Profesi Ners",
                "Profesi Bidan",
                "D3 Kebidanan",
                "D3 RMIK",
                "D4 Manajemen Informasi Kesehatan"
            ],
            "FAKULTAS ILMU KOMPUTER" => [
                "S1 Teknik Informatika",
                "S1 Sistem Informasi"
            ],
            "FAKULTAS ILMU KOMUNIKASI DAN HUKUM" => [
                "S1 Ilmu Komunikasi",
                "S1 Ilmu Hukum"
            ]
        ];

        // Prepare a structure to hold counts
        $counts = [];
        foreach ($facultyMapping as $fac => $prodiList) {
            foreach ($prodiList as $pName) {
                $counts[$pName] = [
                    'total' => 0,
                    'classes' => [
                        'Jalur A (Reguler)' => ['daftar' => 0, 'registrasi' => 0],
                        'Program RPLA1' => ['daftar' => 0, 'registrasi' => 0],
                        'Program RPLA2' => ['daftar' => 0, 'registrasi' => 0],
                        'Jalur B (Beasiswa)' => ['daftar' => 0, 'registrasi' => 0],
                        'Jalur Pascasarjana' => ['daftar' => 0, 'registrasi' => 0],
                    ]
                ];
            }
        }

        foreach ($registrations as $reg) {
            $ps = $reg->program_studi;
            $matchedProdi = null;
            $matchedProgram = 'Jalur A (Reguler)'; // Default

            // Find Prodi
            foreach ($standardProdis as $key => $val) {
                if (stripos($ps, $key) !== false) {
                    $matchedProdi = $val;
                    break;
                }
            }

            // Find Program
            foreach ($standardPrograms as $key => $val) {
                if (stripos($ps, $key) !== false) {
                    $matchedProgram = $val;
                    break;
                }
            }

            if ($matchedProdi && isset($counts[$matchedProdi])) {
                $counts[$matchedProdi]['total']++;
                $counts[$matchedProdi]['classes'][$matchedProgram]['daftar']++;
                if (in_array($reg->id, $verifiedRegIds)) {
                    $counts[$matchedProdi]['classes'][$matchedProgram]['registrasi']++;
                }
            }
        }

        // Transform $counts back to the $result format
        $result = [];
        foreach ($facultyMapping as $facultyName => $prodiList) {
            $result[$facultyName] = [];
            foreach ($prodiList as $prodiName) {
                $c = $counts[$prodiName];
                $classes = [];
                $isRegOnly = in_array($prodiName, $regulerOnlyProdis);

                foreach ($c['classes'] as $className => $vals) {
                    // If it's a Reguler Only prodi, only show Jalur A (Reguler)
                    if ($isRegOnly) {
                        if ($className === 'Jalur A (Reguler)') {
                            $classes[] = [
                                'name' => $className,
                                'daftar' => $vals['daftar'],
                                'registrasi' => $vals['registrasi']
                            ];
                        }
                        continue;
                    }

                    // Otherwise, only show if there's data OR if it's one of the main ones (Reguler, RPLA1, RPLA2)
                    if ($vals['daftar'] > 0 || in_array($className, ['Jalur A (Reguler)', 'Program RPLA1', 'Program RPLA2'])) {
                        $classes[] = [
                            'name' => $className,
                            'daftar' => $vals['daftar'],
                            'registrasi' => $vals['registrasi']
                        ];
                    }
                }
                $result[$facultyName][] = [
                    'name' => $prodiName,
                    'total' => $c['total'],
                    'classes' => $classes
                ];
            }
        }

        return response()->json($result);
    }

    public function getAttendances()
    {
        $attendances = Attendance::with(['registration.biodata'])
            ->orderBy('attended_at', 'desc')
            ->get();
        return response()->json($attendances);
    }

    private function getRandomColor()
    {
        $colors = [
            'bg-[#800080]', 'bg-[#008000]', 'bg-[#FFA500]', 'bg-[#483D8B]', 
            'bg-[#FF4500]', 'bg-[#0000FF]', 'bg-[#FF851B]', 'bg-[#F08080]',
            'bg-[#40E0D0]', 'bg-[#FFD700]', 'bg-[#00CED1]', 'bg-[#8A2BE2]'
        ];
        return $colors[array_rand($colors)];
    }
}
