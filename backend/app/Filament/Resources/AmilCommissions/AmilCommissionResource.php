<?php

namespace App\Filament\Resources\AmilCommissions;

use App\Filament\Resources\AmilCommissions\Pages\ManageAmilCommissions;
use App\Models\AmilCommission;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
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

class AmilCommissionResource extends Resource
{
    protected static ?string $model = AmilCommission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('amil_id')
                    ->relationship('amil', 'id')
                    ->required(),
                Select::make('payment_id')
                    ->relationship('payment', 'id')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                TextInput::make('rate')
                    ->required()
                    ->numeric(),
                Toggle::make('is_paid')
                    ->required(),
                DateTimePicker::make('paid_at'),
                TextInput::make('paid_by'),
                TextInput::make('payment_method'),
                TextInput::make('payment_ref'),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('amil.full_name')
                    ->label('Nama Amil'),
                TextEntry::make('payment.ref_no')
                    ->label('Rujukan Bayaran'),
                TextEntry::make('amount')
                    ->label('Jumlah Komisen')
                    ->money('MYR'),
                TextEntry::make('rate')
                    ->label('Kadar'),
                IconEntry::make('is_paid')
                    ->label('Dibayar?')
                    ->boolean(),
                TextEntry::make('paid_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('paid_by')
                    ->placeholder('-'),
                TextEntry::make('payment_method')
                    ->placeholder('-'),
                TextEntry::make('payment_ref')
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
                TextColumn::make('amil.full_name')
                    ->label('Nama Amil')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('payment.ref_no')
                    ->label('Rujukan Bayaran')
                    ->searchable(),
                TextColumn::make('amount')
                    ->label('Jumlah Komisen')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('rate')
                    ->label('Kadar')
                    ->numeric(4)
                    ->sortable(),
                IconColumn::make('is_paid')
                    ->label('Dibayar?')
                    ->boolean(),
                TextColumn::make('paid_at')
                    ->label('Tarikh Bayaran')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Dicipta Pada')
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
            'index' => ManageAmilCommissions::route('/'),
        ];
    }
}
