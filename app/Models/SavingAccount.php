<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingAccount extends Model
{
    protected $fillable = [
        'user_id',
        'account_number',
        'first_name',
        'last_name',
        'dob',
        'address',
        'balance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
