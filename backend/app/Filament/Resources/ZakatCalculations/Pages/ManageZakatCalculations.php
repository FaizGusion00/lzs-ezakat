<?php

namespace App\Filament\Resources\ZakatCalculations\Pages;

use App\Filament\Resources\ZakatCalculations\ZakatCalculationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageZakatCalculations extends ManageRecords
{
    protected static string $resource = ZakatCalculationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
