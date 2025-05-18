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

        $received = Transaction::with(['senderAccount.user'])
            ->where('receiver_account_id', $account->id)
            ->where('type', 'credit')
            ->take(8)
            ->get()
            ->map(fn($tx) =>
                new TransactionResource($tx, 'Received', 'From: ' . $tx->senderAccount->user?->name)
            );

        $sent = Transaction::with(['receiverAccount.user'])
            ->where('sender_account_id', $account->id)
            ->where('type', 'debit')
            ->take(8)
            ->get()
            ->map(fn($tx) =>
                new TransactionResource($tx, 'Sent', 'To: ' . $tx->receiverAccount->user?->name)
            );

        $transactions = $received->merge($sent)
            ->sortByDesc(fn($tx) => $tx->created_at)
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
