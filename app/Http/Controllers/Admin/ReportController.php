<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Response;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Monthly stats for the general statistics page
        $monthlyStats = $this->getMonthlyStats();
        
        $totalResponden = Response::count();
        $avgSatisfaction = DB::table('answers')->avg('score') ?: 0;
        
        return Inertia::render('Admin/Reports', [
            'monthlyStats' => $monthlyStats,
            'summary' => [
                'total' => $totalResponden,
                'avg' => round($avgSatisfaction, 1),
            ],
            'filters' => $request->only(['month']),
        ]);
    }

    public function full(Request $request)
    {
        $query = Response::with(['answers.question'])->orderBy('created_at', 'desc');

        // Robust Filtering
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        } elseif ($request->filled('month')) {
            $query->where(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"), $request->month);
        }

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('lokasi', 'like', '%' . $request->search . '%');
        }

        $allResponses = $query->get();
        
        $responses = $allResponses->map(function ($response) {
            return [
                'id' => $response->id,
                'nama' => $response->nama,
                'no_wa' => $response->no_wa,
                'lokasi' => $response->lokasi,
                'tanggal' => $response->created_at->format('d-m-Y H:i'),
                'avg' => round($response->average_score, 1),
                'answers' => $response->answers->map(function ($a) {
                    return [
                        'q' => $a->question->question ?? 'N/A',
                        's' => $a->score
                    ];
                }),
                'kritik_saran' => $response->kritik_saran,
            ];
        });

        // Calculate Stats for the Filtered Selection
        $total = $allResponses->count();
        $avg = $allResponses->count() > 0 ? round($allResponses->avg(function($r) { return $r->average_score; }), 1) : 0;
        
        $sangatPuas = 0; $puas = 0; $cukup = 0; $kurang = 0;
        foreach($allResponses as $res) {
            $score = $res->average_score;
            if ($score >= 85) $sangatPuas++;
            elseif ($score >= 70) $puas++;
            elseif ($score >= 55) $cukup++;
            else $kurang++;
        }

        $questions = Question::orderBy('order')->get()->map(function($q) use ($allResponses) {
            // Average per question for the selection
            $sum = 0; $count = 0;
            foreach($allResponses as $res) {
                $ans = $res->answers->where('question_id', $q->id)->first();
                if($ans) { $sum += $ans->score; $count++; }
            }
            return [
                'id' => $q->id,
                'text' => $q->question,
                'avg' => $count > 0 ? round($sum / $count, 1) : 0
            ];
        });

        return Inertia::render('Admin/FullReport', [
            'responses' => $responses,
            'questions' => $questions,
            'stats' => [
                'total' => $total,
                'avg' => $avg,
                'categories' => [
                    ['name' => 'Sangat Puas', 'value' => $sangatPuas, 'color' => '#10B981'],
                    ['name' => 'Puas', 'value' => $puas, 'color' => '#3B82F6'],
                    ['name' => 'Cukup', 'value' => $cukup, 'color' => '#F59E0B'],
                    ['name' => 'Kurang', 'value' => $kurang, 'color' => '#EF4444'],
                ]
            ],
            'filters' => $request->all(),
            'monthlyOptions' => Response::select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"))->distinct()->orderBy('month', 'desc')->pluck('month')
        ]);
    }

    private function getMonthlyStats()
    {
        return Response::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
            DB::raw("COUNT(*) as total"),
            DB::raw("AVG((SELECT AVG(score) FROM answers WHERE response_id = responses.id)) as avg_score")
        )
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->limit(12)
        ->get();
    }
}
