<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@argapura.gov',
            'password' => Hash::make('password'),
        ]);

        // Default Questions
        $questions = [
            'Bagaimana penilaian Anda terhadap kemudahan prosedur pelayanan di Balai KB Argapura?',
            'Bagaimana penilaian Anda terhadap kesesuaian persyaratan pelayanan dengan jenis pelayanannya?',
            'Bagaimana penilaian Anda terhadap kejelasan dan kepastian petugas yang melayani?',
            'Bagaimana penilaian Anda terhadap kedisiplinan petugas dalam memberikan pelayanan?',
            'Bagaimana penilaian Anda terhadap tanggung jawab petugas dalam memberikan pelayanan?',
            'Bagaimana penilaian Anda terhadap kemampuan petugas dalam memberikan pelayanan?',
            'Bagaimana penilaian Anda terhadap kecepatan waktu dalam memberikan pelayanan?',
            'Bagaimana penilaian Anda terhadap keadilan mendapatkan pelayanan?',
            'Bagaimana penilaian Anda terhadap kesopanan dan keramahan petugas dalam memberikan pelayanan?'
        ];

        foreach ($questions as $index => $q) {
            Question::create([
                'question' => $q,
                'is_active' => true,
                'order' => $index + 1,
            ]);
        }
    }
}
