<?php

namespace App\Filament\Resources\ZakatTypes\Pages;

use App\Filament\Resources\ZakatTypes\ZakatTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageZakatTypes extends ManageRecords
{
    protected static string $resource = ZakatTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
