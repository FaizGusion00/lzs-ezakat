<?php

namespace App\Filament\Resources\ZakatTypes;

use App\Filament\Resources\ZakatTypes\Pages\ManageZakatTypes;
use App\Models\ZakatType;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ZakatTypeResource extends Resource
{
    protected static ?string $model = ZakatType::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('type')
                    ->options([
            'pendapatan' => 'Pendapatan',
            'perniagaan' => 'Perniagaan',
            'emas_perak' => 'Emas perak',
            'simpanan' => 'Simpanan',
            'saham' => 'Saham',
            'takaful' => 'Takaful',
            'pertanian' => 'Pertanian',
            'ternakan' => 'Ternakan',
            'lain' => 'Lain',
        ])
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('name_en'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('nisab')
                    ->numeric(),
                TextInput::make('haul_days')
                    ->required()
                    ->numeric()
                    ->default(355),
                TextInput::make('rate')
                    ->required()
                    ->numeric()
                    ->default(0.025),
                TextInput::make('formula'),
                Toggle::make('is_active')
                    ->required(),
                TextInput::make('display_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name')
                    ->label('Nama'),
                TextEntry::make('type')
                    ->label('Jenis')
                    ->badge(),
                TextEntry::make('nisab')
                    ->label('Nisab (RM)')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('rate')
                    ->label('Kadar')
                    ->numeric(),
                IconEntry::make('is_active')
                    ->label('Aktif?')
                    ->boolean(),
                TextEntry::make('display_order')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Jenis')
                    ->badge(),
                TextColumn::make('nisab')
                    ->label('Nisab (RM)')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('rate')
                    ->label('Kadar')
                    ->numeric(4)
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Aktif?')
                    ->boolean(),
                TextColumn::make('display_order')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageZakatTypes::route('/'),
        ];
    }
}
