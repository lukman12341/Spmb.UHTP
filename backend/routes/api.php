<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\PaymentConfirmationController;
use App\Http\Controllers\AdminPaymentController;
use App\Http\Controllers\BiodataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SoalController;
use App\Http\Controllers\AdminKesehatanController;

Route::get('/user', function (Request $request) {

    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [RegistrationController::class, 'store']);
Route::post('/login', [RegistrationController::class, 'login']);
Route::post('/forgot-password', [RegistrationController::class, 'forgotPassword']);

Route::post('/payment', [PaymentConfirmationController::class, 'store']);
Route::get('/payment/status/{kode_pembayaran}', [PaymentConfirmationController::class, 'checkStatus']);

Route::post('/biodata', [BiodataController::class, 'store']);
Route::get('/biodata/{registration_id}', [BiodataController::class, 'show']);
Route::post('/biodata/finalize', [BiodataController::class, 'finalize']);

// Admin Routes
Route::post('/admin/login', [AdminPaymentController::class, 'login']);
Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
Route::get('/dashboard/detail-stats', [DashboardController::class, 'getDetailStats']);
Route::get('/admin/attendances', [DashboardController::class, 'getAttendances']);
Route::get('/admin/payments', [AdminPaymentController::class, 'index']);
Route::post('/admin/payments/{id}/status', [AdminPaymentController::class, 'updateStatus']);
Route::get('/admin/biodatas', [BiodataController::class, 'index']);
Route::post('/admin/biodatas/{id}/reject', [BiodataController::class, 'reject']);
Route::post('/admin/users/{id}/reset-password', [RegistrationController::class, 'resetPassword']);
Route::get('/admin/kesehatan', [AdminKesehatanController::class, 'index']);
Route::get('/admin/kesehatan/options', [AdminKesehatanController::class, 'getOptions']);
Route::post('/admin/kesehatan/{id}/status', [AdminKesehatanController::class, 'updateStatus']);
Route::post('/admin/kesehatan/update-skor', [AdminKesehatanController::class, 'updateSkor']);
Route::post('/exam/kesehatan/store', [AdminKesehatanController::class, 'storeKesehatan']);
Route::post('/exam/wawancara/store-answers', [AdminKesehatanController::class, 'storeWawancaraAnswers']);
Route::get('/exam/check-status/{no_ujian}', [AdminKesehatanController::class, 'checkStatus']);
Route::get('/admin/wawancara', [AdminKesehatanController::class, 'index']);
Route::post('/admin/wawancara/{id}/status', [AdminKesehatanController::class, 'updateWawancara']);
Route::post('/exam/registrasi/store', [BiodataController::class, 'storeRegistrasi']);
Route::post('/admin/registrasi/{id}/verify', [BiodataController::class, 'verifyRegistrasi']);
Route::post('/admin/kelulusan/{id}/status', [AdminKesehatanController::class, 'updateKelulusan']);

// Soal Routes
Route::post('/soal/store', [SoalController::class, 'store']);
Route::get('/soal', [SoalController::class, 'index']);
Route::post('/soal/{id}/update', [SoalController::class, 'update']);
Route::post('/soal/{id}/toggle-status', [SoalController::class, 'toggleStatus']);
// Jadwal Routes
Route::get('/jadwal', [\App\Http\Controllers\JadwalUjianController::class, 'index']);
Route::post('/jadwal/store', [\App\Http\Controllers\JadwalUjianController::class, 'store']);
Route::post('/jadwal/{id}/update', [\App\Http\Controllers\JadwalUjianController::class, 'update']);
Route::delete('/jadwal/{id}', [\App\Http\Controllers\JadwalUjianController::class, 'destroy']);
