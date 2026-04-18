<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::orderBy('order')->get();
        return Inertia::render('Admin/Questions', [
            'questions' => $questions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'is_active' => 'boolean',
        ]);

        $maxOrder = Question::max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;

        Question::create($validated);

        return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        $question->update($validated);

        return redirect()->back()->with('success', 'Pertanyaan berhasil diperbarui.');
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return redirect()->back()->with('success', 'Pertanyaan berhasil dihapus.');
    }

    public function toggleActive(Question $question)
    {
        $question->update(['is_active' => !$question->is_active]);
        return redirect()->back()->with('success', 'Status pertanyaan diperbarui.');
    }
}
