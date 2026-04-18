<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['question', 'is_active', 'order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
