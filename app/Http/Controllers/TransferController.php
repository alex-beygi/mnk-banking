<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SavingAccount;
use App\Models\Transaction;
use App\Services\CurrencyConverter;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Events\TransactionMade;
use Illuminate\Support\Facades\Broadcast;

class TransferController extends Controller
{

    public function __invoke(){
        return Inertia::render('User/TransferFunds');
    }

    public function transfer(Request $request, CurrencyConverter $converter)
    {
        $request->validate([
            'to_account_number' => [
                'required',
                'exists:saving_accounts,account_number',
                function ($attribute, $value, $fail) {
                    $senderAccount = SavingAccount::where('user_id', auth()->id())->first();
                    if ($senderAccount && $senderAccount->account_number === $value) {
                        $fail('You cannot transfer to your own account.');
                    }
                },
            ],
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|in:USD,EUR,GBP',
        ]);
    
        $senderAccount = SavingAccount::where('user_id', auth()->id())->firstOrFail();
        $recipientAccount = SavingAccount::where('account_number', $request->to_account_number)->firstOrFail();
        
        $amount = (float) $request->amount;
        $selectedCurrency = $request->currency;
        $baseCurrency = 'USD';
    
        if ($senderAccount->balance < $amount) {
            return back()->withErrors(['amount' => 'Insufficient funds']);
        }
    
        try {
            DB::beginTransaction();
        
            // Convert to USD
            $conversionRate = $converter->getConversionRate($selectedCurrency, $baseCurrency); // e.g., EUR -> USD
            $amountInUSD = $amount * $conversionRate;
            $sharedTransactionId = (string) Str::uuid();
        
            // 1. Check if sender has enough in USD
            if ($senderAccount->balance < $amountInUSD) {
                throw new \Exception('Insufficient funds in USD.');
            }
        
            // 2. Debit sender in USD
            $senderAccount->decrement('balance', $amountInUSD);
        
            Transaction::create([
                'transaction_id'        => $sharedTransactionId,
                'sender_account_id'     => $senderAccount->id,
                'receiver_account_id'   => $recipientAccount->id,
                'amount'                => $amount, // original currency amount
                'currency'              => $selectedCurrency,
                'type'                  => 'debit',
                'description'           => "Sent to {$recipientAccount->account_number}",
            ]);
        
            // 3. Credit recipient in USD (same amount as debited)
            $recipientAccount->increment('balance', $amountInUSD);
        
            $transaction =  Transaction::create([
                'transaction_id'        => $sharedTransactionId,
                'sender_account_id'     => $senderAccount->id,
                'receiver_account_id'   => $recipientAccount->id,
                'amount'                => $amount,
                'currency'              => $selectedCurrency,
                'type'                  => 'credit',
                'description'           => "Received from {$senderAccount->account_number}",
            ]);
            
            // Broadcast the transaction to the receiver
            broadcast(new TransactionMade($transaction, $recipientAccount->user_id));
            DB::commit();
        
            return redirect()->back()->with('success', 'Transfer completed successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
        
            return back()->withErrors([
                'error' => 'Transfer failed: ' . $e->getMessage()
            ]);
        }
    }
}
