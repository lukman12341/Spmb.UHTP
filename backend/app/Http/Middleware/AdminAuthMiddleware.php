<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-Admin-Token') ?: $request->bearerToken();

        if (!$token || !Cache::has('admin_token_' . $token)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Admin session invalid or expired.'
            ], 401);
        }

        // Extend cache lifetime for another 2 hours on activity
        Cache::put('admin_token_' . $token, true, now()->addHours(2));

        return $next($request);
    }
}
