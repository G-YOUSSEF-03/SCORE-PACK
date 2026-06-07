<?php

use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\NewsController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\QuoteRequestController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\QuoteRequestController as PublicQuoteRequestController;
use Illuminate\Support\Facades\Route;

Route::post('contact/messages', [ContactController::class, 'store'])->middleware('throttle:contact');
Route::post('quote-requests', [PublicQuoteRequestController::class, 'store'])->middleware('throttle:quote-requests');

Route::prefix('public')->group(function (): void {
    Route::get('services', [PublicController::class, 'services']);
    Route::get('services/{slug}', [PublicController::class, 'serviceDetails']);
    Route::get('projects', [PublicController::class, 'projects']);
    Route::get('news', [PublicController::class, 'news']);
    Route::get('news/{slug}', [PublicController::class, 'newsDetails']);
    Route::get('settings', [PublicController::class, 'settings']);
    Route::post('quote-requests', [PublicQuoteRequestController::class, 'store'])->middleware('throttle:quote-requests');
    Route::post('contact-messages', [ContactController::class, 'store'])->middleware('throttle:contact');
});

Route::prefix('auth')->group(function (): void {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('profile', [AuthController::class, 'profile']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function (): void {
    Route::get('dashboard', DashboardController::class);

    Route::apiResource('services', ServiceController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('users', UserController::class);
    Route::get('settings', [SettingController::class, 'show']);
    Route::match(['put', 'patch'], 'settings', [SettingController::class, 'update']);

    Route::get('quote-requests', [QuoteRequestController::class, 'index']);
    Route::get('quote-requests/{quoteRequest}', [QuoteRequestController::class, 'show']);
    Route::patch('quote-requests/{quoteRequest}/read', [QuoteRequestController::class, 'markAsRead']);
    Route::patch('quote-requests/{quoteRequest}/status', [QuoteRequestController::class, 'updateStatus']);
    Route::patch('quote-requests/{quoteRequest}', [QuoteRequestController::class, 'update']);
    Route::post('quote-requests/{quoteRequest}/reply', [QuoteRequestController::class, 'reply']);
    Route::delete('quote-requests/{quoteRequest}', [QuoteRequestController::class, 'destroy']);

    Route::get('contact-messages', [ContactMessageController::class, 'index']);
    Route::get('contact-messages/{contactMessage}', [ContactMessageController::class, 'show']);
    Route::patch('contact-messages/{contactMessage}/read', [ContactMessageController::class, 'markAsRead']);
    Route::post('contact-messages/{contactMessage}/reply', [ContactMessageController::class, 'reply']);
    Route::delete('contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy']);
});
