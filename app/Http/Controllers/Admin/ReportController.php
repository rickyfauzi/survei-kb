<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Monthly Respondents Statistics (Last 12 Months)
        $monthlyStats = Response::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw("COUNT(*) as total"),
                DB::raw("AVG((SELECT AVG(score) FROM answers WHERE response_id = responses.id)) as avg_score")
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // 2. Summary Statistics
        $totalResponden = Response::count();
        $avgSatisfaction = DB::table('answers')->avg('score') ?: 0;
        
        // 3. Respondents List (Filtered)
        $query = Response::with(['answers.question'])->orderBy('created_at', 'desc');

        if ($request->filled('month')) {
            $query->where(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"), $request->month);
        }

        $responses = $query->get()->map(function ($response) {
            return [
                'id' => $response->id,
                'nama' => $response->nama,
                'no_wa' => $response->no_wa,
                'lokasi' => $response->lokasi,
                'rata_rata' => round($response->average_score, 1),
                'tanggal' => $response->created_at->format('d-m-Y'),
                'kritik_saran' => $response->kritik_saran,
            ];
        });

        return Inertia::render('Admin/Reports', [
            'monthlyStats' => $monthlyStats,
            'summary' => [
                'total' => $totalResponden,
                'avg' => round($avgSatisfaction, 1),
            ],
            'responses' => $responses,
            'filters' => $request->only(['month']),
        ]);
    }
}
