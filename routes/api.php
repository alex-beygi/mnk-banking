<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\SavingAccount;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



