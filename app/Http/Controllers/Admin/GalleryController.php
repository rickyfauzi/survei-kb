<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::latest()->paginate(12);
        return Inertia::render('Admin/Gallery', [
            'galleries' => $galleries,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'description' => 'nullable|string|max:1000',
        ]);

        $imagePath = $request->file('image')->store('galleries', 'public');

        Gallery::create([
            'title' => $request->title,
            'image' => $imagePath,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Foto berhasil ditambahkan ke galeri.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image && Storage::disk('public')->exists($gallery->image)) {
            Storage::disk('public')->delete($gallery->image);
        }
        
        $gallery->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus dari galeri.');
    }
}
