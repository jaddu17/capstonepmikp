<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

if (!interface_exists('SessionHandlerInterface', false)) {
    interface SessionHandlerInterface {
        public function close(): bool;
        public function destroy(string $id): bool;
        public function gc(int $max_lifetime): int|false;
        public function open(string $path, string $name): bool;
        public function read(string $id): string|false;
        public function write(string $id, string $data): bool;
    }
}
if (!interface_exists('SessionIdInterface', false)) {
    interface SessionIdInterface {
        public function create_sid(): string;
    }
}
if (!interface_exists('SessionUpdateTimestampHandlerInterface', false)) {
    interface SessionUpdateTimestampHandlerInterface {
        public function validateId(string $id): bool;
        public function updateTimestamp(string $id, string $data): bool;
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\SecurityHeadersMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
