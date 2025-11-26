<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'amil_id',
        'zakat_calc_id',
        'zakat_type_id',
        'amount',
        'status',
        'method',
        'ref_no',
        'gateway_ref',
        'gateway_response',
        'payment_year',
        'payment_month',
        'year_month',
        'paid_at',
        'failed_reason',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'amount' => 'decimal:4',
        'gateway_response' => 'array',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function amil(): BelongsTo
    {
        return $this->belongsTo(User::class, 'amil_id');
    }

    public function zakatCalculation(): BelongsTo
    {
        return $this->belongsTo(ZakatCalculation::class, 'zakat_calc_id');
    }

    public function zakatType(): BelongsTo
    {
        return $this->belongsTo(ZakatType::class);
    }

    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class);
    }

    public function commission(): HasOne
    {
        return $this->hasOne(AmilCommission::class);
    }
}
