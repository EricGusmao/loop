<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BucketStudyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Bucket $bucket)
    {
        Gate::authorize('view', $bucket);

        $bucket->load('cards');

        $shuffledCards = $bucket->cards->fisherYatesShuffle();

        return Inertia::render('buckets/study', [
            'cards' => $shuffledCards,
        ]);
    }
}
