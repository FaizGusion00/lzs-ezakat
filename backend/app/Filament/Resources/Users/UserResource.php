<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\ManageUsers;
use App\Models\User;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'lzs-ezakat';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('role')
                    ->options([
            'payer_individual' => 'Payer individual',
            'payer_company' => 'Payer company',
            'amil' => 'Amil',
            'admin' => 'Admin',
        ])
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->required(),
                TextInput::make('phone')
                    ->tel(),
                DateTimePicker::make('phone_verified_at'),
                TextInput::make('mykad_ssm'),
                TextInput::make('full_name')
                    ->required(),
                Select::make('branch_id')
                    ->relationship('branch', 'name'),
                TextInput::make('profile_data'),
                Toggle::make('is_verified')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                DateTimePicker::make('last_login'),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('full_name')
                    ->label('Nama Penuh'),
                TextEntry::make('email')
                    ->label('Emel'),
                TextEntry::make('role')
                    ->label('Peranan')
                    ->badge(),
                TextEntry::make('branch.name')
                    ->label('Cawangan')
                    ->placeholder('-'),
                TextEntry::make('phone')
                    ->label('No. Telefon')
                    ->placeholder('-'),
                IconEntry::make('is_verified')
                    ->label('Disahkan?')
                    ->boolean(),
                IconEntry::make('is_active')
                    ->label('Aktif?')
                    ->boolean(),
                TextEntry::make('last_login')
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
            ->recordTitleAttribute('lzs-ezakat')
            ->columns([
                TextColumn::make('full_name')
                    ->label('Nama Penuh')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Emel')
                    ->searchable(),
                TextColumn::make('role')
                    ->label('Peranan')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'amil' => 'warning',
                        'payer_individual', 'payer_company' => 'info',
                        default => 'gray',
                    }),
                TextColumn::make('branch.name')
                    ->label('Cawangan')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('No. Telefon')
                    ->searchable(),
                IconColumn::make('is_verified')
                    ->label('Disahkan?')
                    ->boolean(),
                IconColumn::make('is_active')
                    ->label('Aktif?')
                    ->boolean(),
                TextColumn::make('last_login')
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
            'index' => ManageUsers::route('/'),
        ];
    }
}
