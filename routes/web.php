<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ResponseController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/survey', [SurveyController::class, 'index'])->name('survey.index');
Route::post('/survey', [SurveyController::class, 'store'])->name('survey.store');
Route::get('/thank-you', [SurveyController::class, 'thankyou'])->name('survey.thankyou');

// API Routes for Survey (Optional, if using separate frontend)
Route::prefix('api')->group(function () {
    Route::get('/questions', [SurveyController::class, 'apiQuestions']);
    Route::get('/statistics', [SurveyController::class, 'apiStatistics']);
    Route::post('/survey', [SurveyController::class, 'apiStore']);
});

// Admin Routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Questions Management
    Route::resource('questions', QuestionController::class)->except(['create', 'show', 'edit']);
    Route::patch('questions/{question}/toggle-active', [QuestionController::class, 'toggleActive'])->name('questions.toggle-active');
    
    // Responses Management
    Route::get('responses', [ResponseController::class, 'index'])->name('responses.index');
    Route::delete('responses/{response}', [ResponseController::class, 'destroy'])->name('responses.destroy');
    
    // Gallery Management
    Route::resource('gallery', AdminGalleryController::class)->only(['index', 'store', 'destroy']);

    // Team Management
    Route::resource('teams', TeamController::class)->except(['create', 'show', 'edit']);

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('admin.reports.index');
    Route::get('reports/full', [ReportController::class, 'full'])->name('admin.reports.full');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
