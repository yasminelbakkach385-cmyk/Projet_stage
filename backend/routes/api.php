<?php

use App\Http\Controllers\PlainteController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes pour les plaintes
Route::get('/plaintes', [PlainteController::class, 'index']);
Route::post('/plaintes', [PlainteController::class, 'store']);
Route::get('/plaintes/{id}', [PlainteController::class, 'show']);
Route::put('/plaintes/{id}', [PlainteController::class, 'update']);
Route::delete('/plaintes/{id}', [PlainteController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin']);

// Routes pour Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route pour le dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);