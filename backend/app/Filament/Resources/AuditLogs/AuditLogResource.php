<?php

namespace App\Filament\Resources\AuditLogs;

use App\Filament\Resources\AuditLogs\Pages\ManageAuditLogs;
use App\Models\AuditLog;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AuditLogResource extends Resource
{
    protected static ?string $model = AuditLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('table_name')
                    ->required(),
                TextInput::make('record_id')
                    ->required(),
                Select::make('user_id')
                    ->relationship('user', 'id'),
                Select::make('action')
                    ->options([
            'INSERT' => 'I n s e r t',
            'UPDATE' => 'U p d a t e',
            'DELETE' => 'D e l e t e',
            'LOGIN' => 'L o g i n',
            'LOGOUT' => 'L o g o u t',
            'EXPORT' => 'E x p o r t',
        ])
                    ->required(),
                TextInput::make('old_data'),
                TextInput::make('new_data'),
                TextInput::make('ip_address'),
                Textarea::make('user_agent')
                    ->columnSpanFull(),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.full_name')
                    ->label('Pengguna')
                    ->placeholder('-'),
                TextEntry::make('action')
                    ->label('Tindakan')
                    ->badge(),
                TextEntry::make('table_name')
                    ->label('Jadual'),
                TextEntry::make('record_id')
                    ->label('ID Rekod'),
                TextEntry::make('ip_address')
                    ->placeholder('-'),
                TextEntry::make('user_agent')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.full_name')
                    ->label('Pengguna')
                    ->searchable(),
                TextColumn::make('action')
                    ->label('Tindakan')
                    ->badge(),
                TextColumn::make('table_name')
                    ->label('Jadual')
                    ->searchable(),
                TextColumn::make('record_id')
                    ->label('ID Rekod')
                    ->searchable(),
                TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->searchable(),
                TextColumn::make('created_at')
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
            'index' => ManageAuditLogs::route('/'),
        ];
    }
}
