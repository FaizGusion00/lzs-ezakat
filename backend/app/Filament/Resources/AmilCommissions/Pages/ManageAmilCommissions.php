<?php

namespace App\Filament\Resources\AmilCommissions\Pages;

use App\Filament\Resources\AmilCommissions\AmilCommissionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageAmilCommissions extends ManageRecords
{
    protected static string $resource = AmilCommissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
