<?php

namespace App\Models;

use Illuminate\Support\Str;


use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_id', 'sender_account_id', 'receiver_account_id',
        'amount', 'currency', 'description', 'type',
    ];

    public function senderAccount()
    {
        return $this->belongsTo(SavingAccount::class, 'sender_account_id');
    }
    
    public function receiverAccount()
    {
        return $this->belongsTo(SavingAccount::class, 'receiver_account_id');
    }
}
