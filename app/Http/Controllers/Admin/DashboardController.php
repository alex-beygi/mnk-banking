<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\{User,Transaction};
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(){
        
        $totalUsers = User::where('is_admin', false)->count();
        $totalTransactions = Transaction::count();
        $todaysTransactions = Transaction::whereDate('created_at', Carbon::today())->count();

        return Inertia::render('Admin/Dashboard', compact(
            'totalUsers',
            'totalTransactions',
            'todaysTransactions'
        ));
    }
}
