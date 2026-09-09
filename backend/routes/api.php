<?php

use App\Http\Controllers\PlainteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnnonceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes pour les plaintes
Route::get('/plaintes', [PlainteController::class, 'index']);
Route::post('/plaintes', [PlainteController::class, 'store'])->middleware('auth:sanctum');
Route::get('/plaintes/{id}', [PlainteController::class, 'show']);
Route::get('/plaintes/code/{code}', [PlainteController::class, 'showParCode']);
Route::post('/plaintes/code/{code}/avis', [PlainteController::class, 'envoyerAvis']);
Route::put('/plaintes/code/{code}/avis', [PlainteController::class, 'envoyerAvis']);
Route::put('/plaintes/{id}', [PlainteController::class, 'update']);
Route::delete('/plaintes/{id}', [PlainteController::class, 'destroy']);

// Routes pour Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route pour le dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Routes pour les annonces
Route::get('/annonces', [AnnonceController::class, 'index']);
Route::get('/annonces/{id}', [AnnonceController::class, 'show']);
Route::post('/annonces', [AnnonceController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/annonces/{id}', [AnnonceController::class, 'destroy'])->middleware('auth:sanctum');