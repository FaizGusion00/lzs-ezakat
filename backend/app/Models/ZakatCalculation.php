<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ZakatCalculation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'zakat_type_id',
        'amount_gross',
        'amount_deductions',
        'amount_net',
        'zakat_due',
        'status',
        'params',
        'haul_start_date',
        'haul_end_date',
        'haul_remaining_days',
        'notes',
    ];

    protected $casts = [
        'amount_gross' => 'decimal:4',
        'amount_deductions' => 'decimal:4',
        'amount_net' => 'decimal:4',
        'zakat_due' => 'decimal:4',
        'params' => 'array',
        'haul_start_date' => 'date',
        'haul_end_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function zakatType(): BelongsTo
    {
        return $this->belongsTo(ZakatType::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'zakat_calc_id');
    }
}
