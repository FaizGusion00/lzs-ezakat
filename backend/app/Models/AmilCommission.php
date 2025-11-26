<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AmilCommission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'amil_id',
        'payment_id',
        'amount',
        'rate',
        'is_paid',
        'paid_at',
        'paid_by',
        'payment_method',
        'payment_ref',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:4',
        'rate' => 'decimal:4',
        'is_paid' => 'boolean',
        'paid_at' => 'datetime',
    ];

    public function amil(): BelongsTo
    {
        return $this->belongsTo(User::class, 'amil_id');
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
