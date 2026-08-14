<?php

use App\Http\Controllers\PlainteController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes pour les plaintes
Route::get('/plaintes', [PlainteController::class, 'index']);
Route::post('/plaintes', [PlainteController::class, 'store']);
Route::get('/plaintes/{id}', [PlainteController::class, 'show']);
Route::put('/plaintes/{id}', [PlainteController::class, 'update']);
Route::delete('/plaintes/{id}', [PlainteController::class, 'destroy']);

// Route pour le dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);