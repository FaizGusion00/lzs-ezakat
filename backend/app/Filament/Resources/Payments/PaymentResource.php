<?php

namespace App\Filament\Resources\Payments;

use App\Filament\Resources\Payments\Pages\ManagePayments;
use App\Models\Payment;
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
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'id')
                    ->required(),
                Select::make('amil_id')
                    ->relationship('amil', 'id'),
                TextInput::make('zakat_calc_id'),
                Select::make('zakat_type_id')
                    ->relationship('zakatType', 'name')
                    ->required(),
                TextInput::make('amount')
                    ->required()
                    ->numeric(),
                Select::make('status')
                    ->options([
            'pending' => 'Pending',
            'processing' => 'Processing',
            'success' => 'Success',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
            'cancelled' => 'Cancelled',
        ])
                    ->default('pending')
                    ->required(),
                Select::make('method')
                    ->options([
            'fpx' => 'Fpx',
            'jompay' => 'Jompay',
            'ewallet' => 'Ewallet',
            'card' => 'Card',
            'qr' => 'Qr',
            'cash' => 'Cash',
            'bank_transfer' => 'Bank transfer',
        ])
                    ->required(),
                TextInput::make('ref_no')
                    ->required(),
                TextInput::make('gateway_ref'),
                TextInput::make('gateway_response'),
                TextInput::make('payment_year')
                    ->required()
                    ->numeric(),
                TextInput::make('payment_month')
                    ->required()
                    ->numeric(),
                TextInput::make('year_month')
                    ->required(),
                DateTimePicker::make('paid_at'),
                Textarea::make('failed_reason')
                    ->columnSpanFull(),
                TextInput::make('ip_address'),
                Textarea::make('user_agent')
                    ->columnSpanFull(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('ref_no')
                    ->label('No. Rujukan')
                    ->copyable(),
                TextEntry::make('user.full_name')
                    ->label('Pembayar'),
                TextEntry::make('amil.full_name')
                    ->label('Amil')
                    ->placeholder('Tiada'),
                TextEntry::make('zakatType.name')
                    ->label('Jenis Zakat')
                    ->badge()
                    ->color('info'),
                TextEntry::make('amount')
                    ->label('Jumlah')
                    ->money('MYR'),
                TextEntry::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'pending' => 'warning',
                        'failed', 'cancelled' => 'danger',
                        default => 'gray',
                    }),
                TextEntry::make('method')
                    ->label('Kaedah')
                    ->badge(),
                TextEntry::make('gateway_ref')
                    ->label('Rujukan Gateway')
                    ->placeholder('-'),
                TextEntry::make('payment_year')
                    ->numeric(),
                TextEntry::make('payment_month')
                    ->numeric(),
                TextEntry::make('year_month'),
                TextEntry::make('paid_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('failed_reason')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('ip_address')
                    ->placeholder('-'),
                TextEntry::make('user_agent')
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
                TextColumn::make('ref_no')
                    ->label('No. Rujukan')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('user.full_name')
                    ->label('Pembayar')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('zakatType.name')
                    ->label('Jenis Zakat')
                    ->badge()
                    ->color('info')
                    ->searchable(),
                TextColumn::make('amount')
                    ->label('Jumlah')
                    ->money('MYR')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'pending' => 'warning',
                        'failed', 'cancelled' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('method')
                    ->label('Kaedah')
                    ->badge(),
                TextColumn::make('amil.full_name')
                    ->label('Amil')
                    ->placeholder('Tiada')
                    ->searchable(),
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
            'index' => ManagePayments::route('/'),
        ];
    }
}
