<?php

namespace App\Policies;

use App\Models\Bucket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BucketPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Bucket $bucket): Response
    {
        return $this->isOwner($user, $bucket)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Bucket $bucket): Response
    {
        return $this->isOwner($user, $bucket)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Bucket $bucket): Response
    {
        return $this->isOwner($user, $bucket)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can add to the model.
     */
    public function addTo(User $user, Bucket $bucket): Response
    {
        return $this->isOwner($user, $bucket)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Check if the user is the owner of the bucket.
     */
    private function isOwner(User $user, Bucket $bucket): bool
    {
        return $user->id === $bucket->user_id;
    }
}
