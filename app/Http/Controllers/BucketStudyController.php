<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BucketStudyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Bucket $bucket): Response
    {
        Gate::authorize('view', $bucket);

        $bucket->load('cards');

        $shuffledCards = $bucket->cards->fisherYatesShuffle();

        return Inertia::render('buckets/study', [
            'cards' => $shuffledCards,
            'bucket' => $bucket,
        ]);
    }
}
