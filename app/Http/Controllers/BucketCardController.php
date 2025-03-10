<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use App\Models\Card;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BucketCardController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Bucket $bucket): RedirectResponse
    {
        Gate::authorize('addTo', $bucket);

        $validated = $request->validate([
            'front' => 'required|string',
            'back' => 'required|string',
        ]);

        $bucket->cards()->create($validated);

        return to_route('buckets.show', $bucket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bucket $bucket, Card $card): RedirectResponse
    {
        Gate::authorize('update', $bucket);

        $validated = $request->validate([
            'front' => 'required|string',
            'back' => 'required|string',
        ]);

        $card->update($validated);

        return to_route('buckets.show', $bucket);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bucket $bucket, Card $card): RedirectResponse
    {
        Gate::authorize('delete', $bucket);

        $card->delete();

        return to_route('buckets.show', $bucket);
    }
}
