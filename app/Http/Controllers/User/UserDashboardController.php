<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\TransactionResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;

class UserDashboardController extends Controller
{
    public function __invoke(){
        $user = Auth::user();
        $account = $user->savingAccount;

        $transactions = Transaction::with([
            'senderAccount.user',
            'receiverAccount.user',
        ])
        ->where(fn($query) => $query
            ->where('sender_account_id', $account->id)
            ->orWhere('receiver_account_id', $account->id)
        )
        ->orderByDesc('created_at')
        ->get()
        ->groupBy('transaction_id')
        ->take(10)
        ->map(fn($group) => $group->firstWhere('sender_account_id', $account->id)
            ?? $group->firstWhere('receiver_account_id', $account->id)
        )
        ->filter()
        ->map(fn($tx) => TransactionResource::make($tx)->forAccount($account))
        ->values();

         return Inertia::render('User/Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'dob' => $account->dob,
                'registered_at' => $user->created_at->toDateString(),
            ],
            'account' => [
                'account_number' => $account->account_number ?? null,
                'balance' => $account->balance ?? 0,
            ],
            'transactions' => $transactions,
        ]);
    }
}
