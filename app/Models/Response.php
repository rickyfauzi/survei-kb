<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $fillable = ['nama', 'angkatan', 'no_wa', 'kritik_saran', 'lokasi'];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function getAverageScoreAttribute()
    {
        return $this->answers()->avg('score') ?? 0;
    }
}
