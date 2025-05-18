<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public static $wrap = null;
    protected $account;

    protected $type;
    protected $description;

    public function __construct($resource, $type, $description)
    {
        parent::__construct($resource);
        $this->type = $type;
        $this->description = $description;
    }

    public function toArray($request)
    {
        return [
            'id'             => $this->id,
            'transaction_id' => $this->transaction_id,
            'type'           => $this->type,
            'amount'         => $this->amount,
            'currency'       => $this->currency,
            'description'    => $this->description,
            'date'           => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
