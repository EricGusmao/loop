<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BucketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $buckets = Auth::user()->buckets()->withCount('cards')->get();

        return Inertia::render('buckets/index', [
            'buckets' => $buckets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', $user->unique('buckets', 'title')],
        ]);

        $user->buckets()->create($validated);

        return to_route('buckets.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Bucket $bucket): Response
    {
        Gate::authorize('view', $bucket);

        $bucket->load('cards');

        return Inertia::render('buckets/show', [
            'bucket' => $bucket,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bucket $bucket): RedirectResponse
    {
        Gate::authorize('update', $bucket);

        $user = Auth::user();

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                $user->unique('buckets', 'title')->ignoreModel($bucket),
            ],
        ]);

        $bucket->update($validated);

        return to_route('buckets.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bucket $bucket): RedirectResponse
    {
        Gate::authorize('delete', $bucket);

        $bucket->delete();

        return to_route('buckets.index');
    }
}
