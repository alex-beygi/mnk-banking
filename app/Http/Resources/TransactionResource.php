<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public static $wrap = null;
    protected $account;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $account = $this->additional['account'] ?? null;
        $isSender = $this->sender_account_id === $account?->id;

        return [
            'id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'type' => $isSender ? 'Sent' : 'Received',
            'amount' => $this->amount,
            'currency' => $this->currency,
            'description' => $isSender
                ? 'To: ' . optional($this->receiverAccount->user)?->name
                : 'From: ' . optional($this->senderAccount->user)?->name,
            'date' => $this->created_at->format('d/m/Y, H:i:s'),
        ];
    }

    public function forAccount($account)
    {
        $this->account = $account;
        return $this;
    }

    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
