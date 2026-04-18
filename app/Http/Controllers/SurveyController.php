<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index(Request $request)
    {
        $questions = Question::active()->orderBy('order')->get();
        $lokasi = $request->query('lokasi', null);

        return Inertia::render('Survey', [
            'questions' => $questions,
            'lokasi' => $lokasi,
        ]);
    }

    public function store(Request $request)
    {
        // Rate limiting: max 5 submissions per IP per hour
        $key = 'survey-submit:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors([
                'message' => 'Terlalu banyak pengiriman. Silakan coba lagi nanti.',
            ]);
        }
        RateLimiter::hit($key, 3600);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'angkatan' => 'required|string|max:100',
            'no_wa' => 'nullable|string|max:20',
            'kritik_saran' => 'nullable|string|max:2000',
            'lokasi' => 'nullable|string|max:100',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.score' => 'required|integer|min:10|max:100',
        ]);

        DB::transaction(function () use ($validated) {
            $response = Response::create([
                'nama' => strip_tags($validated['nama']),
                'angkatan' => strip_tags($validated['angkatan']),
                'no_wa' => strip_tags($validated['no_wa'] ?? ''),
                'kritik_saran' => strip_tags($validated['kritik_saran'] ?? ''),
                'lokasi' => strip_tags($validated['lokasi'] ?? ''),
            ]);

            foreach ($validated['answers'] as $answer) {
                Answer::create([
                    'response_id' => $response->id,
                    'question_id' => $answer['question_id'],
                    'score' => $answer['score'],
                ]);
            }
        });

        return redirect()->route('survey.thankyou');
    }

    public function thankyou()
    {
        return Inertia::render('ThankYou');
    }

    // API endpoints
    public function apiQuestions()
    {
        return response()->json(Question::active()->orderBy('order')->get());
    }

    public function apiStatistics()
    {
        $totalResponden = Response::count();
        $rataKepuasan = Answer::avg('score') ?? 0;

        $distribusi = Answer::select(
            DB::raw("CASE
                WHEN score BETWEEN 10 AND 30 THEN 'Tidak Memuaskan'
                WHEN score BETWEEN 31 AND 60 THEN 'Cukup'
                WHEN score BETWEEN 61 AND 100 THEN 'Sangat Memuaskan'
            END as label"),
            DB::raw('COUNT(*) as total')
        )->groupBy('label')->get();

        $perBulan = Response::select(
            DB::raw("strftime('%Y-%m', created_at) as bulan"),
            DB::raw('COUNT(*) as total')
        )->groupBy('bulan')->orderBy('bulan')->limit(12)->get();

        return response()->json([
            'totalResponden' => $totalResponden,
            'rataKepuasan' => round($rataKepuasan, 1),
            'distribusi' => $distribusi,
            'perBulan' => $perBulan,
        ]);
    }

    public function apiStore(Request $request)
    {
        $key = 'survey-submit:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Rate limit exceeded'], 429);
        }
        RateLimiter::hit($key, 3600);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'angkatan' => 'required|string|max:100',
            'no_wa' => 'nullable|string|max:20',
            'kritik_saran' => 'nullable|string|max:2000',
            'lokasi' => 'nullable|string|max:100',
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.score' => 'required|integer|min:10|max:100',
        ]);

        $response = DB::transaction(function () use ($validated) {
            $response = Response::create([
                'nama' => strip_tags($validated['nama']),
                'angkatan' => strip_tags($validated['angkatan']),
                'no_wa' => strip_tags($validated['no_wa'] ?? ''),
                'kritik_saran' => strip_tags($validated['kritik_saran'] ?? ''),
                'lokasi' => strip_tags($validated['lokasi'] ?? ''),
            ]);

            foreach ($validated['answers'] as $answer) {
                Answer::create([
                    'response_id' => $response->id,
                    'question_id' => $answer['question_id'],
                    'score' => $answer['score'],
                ]);
            }

            return $response;
        });

        return response()->json(['message' => 'Survey berhasil dikirim', 'id' => $response->id], 201);
    }
}
