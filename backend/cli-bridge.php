<?php

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__ . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Read JSON metadata
$meta = json_decode($argv[1] ?? '{}', true) ?: [];

$uri = $meta['REQUEST_URI'] ?? '/';
$method = $meta['REQUEST_METHOD'] ?? 'GET';
$content = file_get_contents('php://stdin');

$request = Illuminate\Http\Request::create(
    $uri,
    $method,
    [],
    [],
    [],
    $meta,
    $content
);

$response = $kernel->handle($request);

// Output HTTP status
echo "---HTTP_STATUS:" . $response->getStatusCode() . "---\n";

// Output HTTP headers as JSON
$headers = [];
foreach ($response->headers->all() as $name => $values) {
    foreach ($values as $val) {
        $headers[] = "$name: $val";
    }
}
echo "---HTTP_HEADERS:" . json_encode($headers) . "---\n";

// Output content
echo $response->getContent();

$kernel->terminate($request, $response);
