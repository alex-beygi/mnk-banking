<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('transaction_id')->index();
            $table->foreignId('sender_account_id')->constrained('saving_accounts')->cascadeOnDelete();
            $table->foreignId('receiver_account_id')->constrained('saving_accounts')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('currency')->default('USD');
            $table->string('description')->nullable();
            $table->enum('type', ['credit', 'debit']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
