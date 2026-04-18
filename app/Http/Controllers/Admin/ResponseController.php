<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResponseController extends Controller
{
    public function index(Request $request)
    {
        $query = Response::with(['answers.question'])->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('angkatan', 'like', "%{$search}%")
                  ->orWhere('no_wa', 'like', "%{$search}%");
        }

        if ($request->has('tanggal_mulai') && $request->has('tanggal_selesai')) {
            $query->whereBetween('created_at', [$request->tanggal_mulai . ' 00:00:00', $request->tanggal_selesai . ' 23:59:59']);
        }

        $responses = $query->paginate(15)->through(function ($response) {
            return [
                'id' => $response->id,
                'nama' => $response->nama,
                'angkatan' => $response->angkatan,
                'no_wa' => $response->no_wa,
                'lokasi' => $response->lokasi,
                'rata_rata' => round($response->average_score, 1),
                'created_at' => $response->created_at->format('Y-m-d H:i:s'),
                'answers' => $response->answers->map(function ($answer) {
                    return [
                        'question' => $answer->question->question ?? 'Pertanyaan dihapus',
                        'score' => $answer->score,
                    ];
                }),
                'kritik_saran' => $response->kritik_saran,
            ];
        });

        return Inertia::render('Admin/Responses', [
            'responses' => $responses,
            'filters' => $request->only(['search', 'tanggal_mulai', 'tanggal_selesai']),
        ]);
    }

    public function destroy(Response $response)
    {
        $response->delete();
        return redirect()->back()->with('success', 'Data responden berhasil dihapus.');
    }
}
