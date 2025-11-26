<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ZakatType extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'type',
        'name',
        'name_en',
        'description',
        'nisab',
        'haul_days',
        'rate',
        'formula',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'nisab' => 'decimal:4',
        'rate' => 'decimal:4',
        'formula' => 'array',
        'is_active' => 'boolean',
    ];

    public function calculations(): HasMany
    {
        return $this->hasMany(ZakatCalculation::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
