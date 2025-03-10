<?php

use App\Http\Controllers\BucketCardController;
use App\Http\Controllers\BucketController;
use App\Http\Controllers\BucketStudyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('buckets', BucketController::class);
    Route::get('buckets/{bucket}/study', [BucketStudyController::class, 'index'])->name('buckets.study');
    Route::scopeBindings()->resource('buckets.cards', BucketCardController::class)->only(['store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
