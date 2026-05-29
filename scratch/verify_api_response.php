<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$no_ujian = '2026300-3693';
echo "Calling checkStatus for: $no_ujian\n";
$controller = new \App\Http\Controllers\AdminKesehatanController();
$response = $controller->checkStatus($no_ujian);
echo "Response JSON:\n";
echo $response->getContent() . "\n";
