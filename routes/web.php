<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{UserAccountController,DashboardController,TransactionController};
use App\Http\Controllers\User\{UserDashboardController};
use App\Http\Controllers\TransferController;
use App\Models\SavingAccount;
use App\Models\Transaction;
use App\Events\TransactionMade;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    'admin',
    config('jetstream.auth_session'),
])->prefix('admin')->group(function () {

    Route::get('/dashboard', DashboardController::class)
    ->name('admin.dashboard');

    Route::get('/user-accounts', UserAccountController::class)
    ->name('admin.user-accounts');

    Route::get('/users/create', [UserAccountController::class, 'create'])
    ->name('admin.users.create');

    Route::post('/users/bulk-store', [UserAccountController::class, 'bulkStore'])
    ->name('admin.users.bulk-store');

    Route::get('/transactions', TransactionController::class)
    ->name('admin.transactions');

});

Route::middleware([
    'auth:sanctum',
    'user',
    config('jetstream.auth_session'),
])->group(function () {

    Route::get('/dashboard', UserDashboardController::class)
    ->name('dashboard');

    Route::get('/transfer', TransferController::class)
    ->name('user.transfer.page');

    Route::post('/transfer', [TransferController::class, 'transfer'])
    ->name('user.transfer');
   
});

Route::get('/api/recipient-name/{account_number}', function ($account_number) {
    $account = SavingAccount::with('user')->where('account_number', $account_number)->firstOrFail();
    return response()->json(['name' => $account->user->name]);
})->middleware('auth:sanctum');

