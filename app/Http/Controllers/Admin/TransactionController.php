<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Support\Collection;
class TransactionController extends Controller
{
    public function __invoke(Request $request){

        $type = request('type');
        
        $transactions = Transaction::with(['senderAccount.user', 'receiverAccount.user'])
        ->when(!empty($type), fn ($q) => $q->where('type', $type))
        ->latest()
        ->paginate(12)
        ->through(function ($tx) {
            return [
                'id'             => $tx->id,
                'transaction_id' => $tx->transaction_id,
                'type'           => $tx->type === 'debit' ? 'Sent' : 'Received',
                'amount'         => $tx->amount,
                'currency'       => $tx->currency,
                'description'    => $tx->description,
                'sender'         => optional($tx->senderAccount->user)?->name,
                'receiver'       => optional($tx->receiverAccount->user)?->name,
                'date'           => $tx->created_at->format('d/m/Y, H:i:s'),
            ];
        });


            
        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => [
                'type' => $type,
            ],
        ]);
    }
}
