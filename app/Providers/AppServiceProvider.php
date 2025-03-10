<?php

namespace App\Providers;

use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Collection::macro('fisherYatesShuffle', function () {
            $items = $this->items;

            for ($i = count($items) - 1; $i > 0; $i--) {
                $j = random_int(0, $i);
                [$items[$i], $items[$j]] = [$items[$j], $items[$i]];
            }

            return new static($items);
        });
    }
}
