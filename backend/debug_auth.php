<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Filament\Facades\Filament;

echo "--- Debugging Auth ---\n";

$email = 'admin@lzs.gov.my';
$password = 'password';

$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found!\n";
    exit(1);
}

echo "User found: " . $user->full_name . " (Role: " . $user->role . ")\n";
echo "Is Active: " . ($user->is_active ? 'Yes' : 'No') . "\n";

if (Hash::check($password, $user->password)) {
    echo "Password check: PASSED\n";
} else {
    echo "Password check: FAILED\n";
}

if (Auth::attempt(['email' => $email, 'password' => $password])) {
    echo "Auth::attempt: SUCCESS\n";
} else {
    echo "Auth::attempt: FAILED\n";
}

// Check Panel Access
try {
    $panel = Filament::getPanel('admin');
    $canAccess = $user->canAccessPanel($panel);
    echo "canAccessPanel: " . ($canAccess ? 'YES' : 'NO') . "\n";
} catch (\Exception $e) {
    echo "Panel check error: " . $e->getMessage() . "\n";
}

echo "\n--- Session Config ---\n";
echo "Driver: " . config('session.driver') . "\n";
echo "Domain: " . config('session.domain') . "\n";
echo "Secure: " . (config('session.secure') ? 'Yes' : 'No') . "\n";
echo "SameSite: " . config('session.same_site') . "\n";
