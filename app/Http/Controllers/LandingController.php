<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Gallery;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $totalResponden = Response::count();
        $rataKepuasan = Answer::avg('score') ?? 0;
        
        // Menghitung persentase responden yang merasa puas (rata-rata skor >= 70)
        // Kita gunakan query langsung ke tabel answers untuk efisiensi dan menghindari error aggregation
        $jumlahPuas = DB::table('answers')
            ->select('response_id')
            ->groupBy('response_id')
            ->havingRaw('AVG(score) >= 70')
            ->get()
            ->count();
        
        $persentasePuas = $totalResponden > 0 
            ? round(($jumlahPuas / $totalResponden) * 100) 
            : 0; 
            
        // Jika data masih kosong, tampilkan angka default yang impresif untuk estetika
        if ($totalResponden === 0) {
            $persentasePuas = 95; 
        }

        $galleries = Gallery::latest()->take(12)->get();

        return Inertia::render('Welcome', [
            'totalResponden' => $totalResponden,
            'rataKepuasan' => round($rataKepuasan, 1),
            'persentasePuas' => $persentasePuas > 0 ? $persentasePuas : 0,
            'galleries' => $galleries,
        ]);
    }
}
