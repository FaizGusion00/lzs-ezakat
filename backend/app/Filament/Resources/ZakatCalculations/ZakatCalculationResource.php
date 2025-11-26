<?php

namespace App\Filament\Resources\ZakatCalculations;

use App\Filament\Resources\ZakatCalculations\Pages\ManageZakatCalculations;
use App\Models\ZakatCalculation;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ZakatCalculationResource extends Resource
{
    protected static ?string $model = ZakatCalculation::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'id')
                    ->required(),
                Select::make('zakat_type_id')
                    ->relationship('zakatType', 'name')
                    ->required(),
                TextInput::make('amount_gross')
                    ->required()
                    ->numeric(),
                TextInput::make('amount_deductions')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('amount_net')
                    ->required()
                    ->numeric(),
                TextInput::make('zakat_due')
                    ->required()
                    ->numeric(),
                Select::make('status')
                    ->options(['wajib' => 'Wajib', 'sunat' => 'Sunat', 'tidak_wajib' => 'Tidak wajib'])
                    ->required(),
                TextInput::make('params')
                    ->required(),
                DatePicker::make('haul_start_date'),
                DatePicker::make('haul_end_date'),
                TextInput::make('haul_remaining_days')
                    ->numeric(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.full_name')
                    ->label('Pembayar'),
                TextEntry::make('zakatType.name')
                    ->label('Jenis Zakat')
                    ->badge()
                    ->color('info'),
                TextEntry::make('amount_gross')
                    ->label('Jumlah Kasar')
                    ->money('MYR'),
                TextEntry::make('amount_deductions')
                    ->label('Tolakan')
                    ->money('MYR'),
                TextEntry::make('amount_net')
                    ->label('Jumlah Bersih')
                    ->money('MYR'),
                TextEntry::make('zakat_due')
                    ->label('Zakat Wajib')
                    ->money('MYR'),
                TextEntry::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'wajib' => 'success',
                        'sunat' => 'warning',
                        'tidak_wajib' => 'gray',
                        default => 'gray',
                    }),
                TextEntry::make('haul_start_date')
                    ->date()
                    ->placeholder('-'),
                TextEntry::make('haul_end_date')
                    ->date()
                    ->placeholder('-'),
                TextEntry::make('haul_remaining_days')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
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
                TextColumn::make('user.full_name')
                    ->label('Pembayar')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('zakatType.name')
                    ->label('Jenis Zakat')
                    ->badge()
                    ->color('info')
                    ->searchable(),
                TextColumn::make('amount_gross')
                    ->label('Jumlah Kasar')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('amount_deductions')
                    ->label('Tolakan')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('amount_net')
                    ->label('Jumlah Bersih')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('zakat_due')
                    ->label('Zakat Wajib')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'wajib' => 'success',
                        'sunat' => 'warning',
                        'tidak_wajib' => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('haul_start_date')
                    ->label('Mula Haul')
                    ->date('d/m/Y')
                    ->sortable(),
                TextColumn::make('haul_end_date')
                    ->label('Tamat Haul')
                    ->date('d/m/Y')
                    ->sortable(),
                TextColumn::make('haul_remaining_days')
                    ->label('Baki Hari')
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
            'index' => ManageZakatCalculations::route('/'),
        ];
    }
}
