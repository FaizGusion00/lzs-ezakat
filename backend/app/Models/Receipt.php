<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'payment_id',
        'receipt_no',
        'pdf_path',
        'pdf_url',
        'qr_code',
        'valid_until',
        'is_printed',
        'print_count',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
        'is_printed' => 'boolean',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
