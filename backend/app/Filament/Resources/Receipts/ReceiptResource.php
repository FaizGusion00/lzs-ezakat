<?php

namespace App\Filament\Resources\Receipts;

use App\Filament\Resources\Receipts\Pages\ManageReceipts;
use App\Models\Receipt;
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

class ReceiptResource extends Resource
{
    protected static ?string $model = Receipt::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('payment_id')
                    ->relationship('payment', 'id')
                    ->required(),
                TextInput::make('receipt_no')
                    ->required(),
                TextInput::make('pdf_path'),
                Textarea::make('pdf_url')
                    ->columnSpanFull(),
                Textarea::make('qr_code')
                    ->columnSpanFull(),
                DateTimePicker::make('valid_until'),
                Toggle::make('is_printed')
                    ->required(),
                TextInput::make('print_count')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('receipt_no')
                    ->label('No. Resit'),
                TextEntry::make('payment.ref_no')
                    ->label('Rujukan Bayaran'),
                TextEntry::make('valid_until')
                    ->label('Sah Sehingga')
                    ->dateTime('d/m/Y')
                    ->placeholder('-'),
                IconEntry::make('is_printed')
                    ->label('Dicetak?')
                    ->boolean(),
                TextEntry::make('print_count')
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
                TextColumn::make('receipt_no')
                    ->label('No. Resit')
                    ->searchable(),
                TextColumn::make('payment.ref_no')
                    ->label('Rujukan Bayaran')
                    ->searchable(),
                TextColumn::make('valid_until')
                    ->label('Sah Sehingga')
                    ->dateTime('d/m/Y')
                    ->sortable(),
                IconColumn::make('is_printed')
                    ->label('Dicetak?')
                    ->boolean(),
                TextColumn::make('print_count')
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
            'index' => ManageReceipts::route('/'),
        ];
    }
}
