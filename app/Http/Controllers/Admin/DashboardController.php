<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalResponden = Response::count();
        $rataKepuasan = round(Answer::avg('score') ?? 0, 1);

        $distribusi = Response::get()->map(function($res) {
            $score = $res->average_score;
            if ($score >= 85) return 'Sangat Puas';
            if ($score >= 70) return 'Puas';
            if ($score >= 55) return 'Cukup';
            return 'Kurang Puas';
        })->countBy()->map(function($count, $label) {
            return ['label' => $label, 'total' => $count];
        })->values();

        $perHari = Response::select(
            DB::raw("DATE(created_at) as tanggal"),
            DB::raw('COUNT(*) as total')
        )->groupBy('tanggal')->orderBy('tanggal', 'desc')->limit(30)->get()->reverse()->values();

        $perBulan = Response::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as bulan"),
            DB::raw('COUNT(*) as total')
        )->groupBy('bulan')->orderBy('bulan')->limit(12)->get();

        $perQuestion = Question::withCount('answers')
            ->withAvg('answers', 'score')
            ->active()
            ->orderBy('order')
            ->get()
            ->map(function ($q) {
                return [
                    'id' => $q->id,
                    'question' => $q->question,
                    'answers_count' => $q->answers_count,
                    'answers_avg_score' => round($q->answers_avg_score ?? 0, 1),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'totalResponden' => $totalResponden,
            'rataKepuasan' => $rataKepuasan,
            'distribusi' => $distribusi,
            'perHari' => $perHari,
            'perBulan' => $perBulan,
            'perQuestion' => $perQuestion,
        ]);
    }
}
