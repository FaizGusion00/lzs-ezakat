<?php

namespace App\Filament\Resources\Notifications;

use App\Filament\Resources\Notifications\Pages\ManageNotifications;
use App\Models\Notification;
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

class NotificationResource extends Resource
{
    protected static ?string $model = Notification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'id')
                    ->required(),
                TextInput::make('type')
                    ->required(),
                TextInput::make('title'),
                Textarea::make('message')
                    ->required()
                    ->columnSpanFull(),
                Select::make('channel')
                    ->options([
            'whatsapp' => 'Whatsapp',
            'email' => 'Email',
            'sms' => 'Sms',
            'push' => 'Push',
            'system' => 'System',
        ])
                    ->required(),
                Toggle::make('is_sent')
                    ->required(),
                Toggle::make('is_read')
                    ->required(),
                TextInput::make('metadata'),
                DateTimePicker::make('scheduled_at'),
                DateTimePicker::make('sent_at'),
                Textarea::make('failed_reason')
                    ->columnSpanFull(),
                DateTimePicker::make('read_at'),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.full_name')
                    ->label('Pengguna'),
                TextEntry::make('title')
                    ->label('Tajuk')
                    ->placeholder('-'),
                TextEntry::make('type')
                    ->label('Jenis'),
                TextEntry::make('message')
                    ->label('Mesej')
                    ->columnSpanFull(),
                TextEntry::make('channel')
                    ->label('Saluran')
                    ->badge(),
                IconEntry::make('is_sent')
                    ->label('Dihantar?')
                    ->boolean(),
                IconEntry::make('is_read')
                    ->label('Dibaca?')
                    ->boolean(),
                TextEntry::make('scheduled_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('sent_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('failed_reason')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('read_at')
                    ->dateTime()
                    ->placeholder('-'),
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
                    ->label('Pengguna')
                    ->searchable(),
                TextColumn::make('title')
                    ->label('Tajuk')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Jenis')
                    ->searchable(),
                TextColumn::make('channel')
                    ->label('Saluran')
                    ->badge(),
                IconColumn::make('is_sent')
                    ->label('Dihantar?')
                    ->boolean(),
                IconColumn::make('is_read')
                    ->label('Dibaca?')
                    ->boolean(),
                TextColumn::make('scheduled_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('sent_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('read_at')
                    ->dateTime()
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
            'index' => ManageNotifications::route('/'),
        ];
    }
}
