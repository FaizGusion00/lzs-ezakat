# 🔒 Security & Compliance Documentation

> **Zakat Selangor - Security Best Practices & Implementation**  
> Author: Faiz Nasir  
> Classification: Confidential  
> Version: 1.0.0

---

## 📑 Table of Contents

- [Security Overview](#security-overview)
- [Security Layers](#security-layers)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Payment Security](#payment-security)
- [API Security](#api-security)
- [Infrastructure Security](#infrastructure-security)
- [Compliance Requirements](#compliance-requirements)
- [Security Checklist](#security-checklist)

---

## 🎯 Security Overview

### Security Goals

| Goal | Description | Implementation |
|------|-------------|----------------|
| **Confidentiality** | Protect sensitive data from unauthorized access | Encryption, access control, secure storage |
| **Integrity** | Ensure data accuracy and prevent tampering | Hashing, digital signatures, audit logs |
| **Availability** | Ensure system uptime and accessibility | Load balancing, backups, DDoS protection |
| **Authentication** | Verify user identity | Multi-factor authentication, secure passwords |
| **Authorization** | Control user permissions | Role-based access control (RBAC) |
| **Accountability** | Track all actions | Comprehensive audit logging |

### Threat Model

**Primary Threats**:
- ✅ Unauthorized access to user accounts
- ✅ SQL injection attacks
- ✅ Cross-site scripting (XSS)
- ✅ Cross-site request forgery (CSRF)
- ✅ Payment fraud
- ✅ Data breaches
- ✅ DDoS attacks
- ✅ Man-in-the-middle attacks

---

## 🛡️ Security Layers

### Defense in Depth Strategy

```
┌─────────────────────────────────────────────────────────┐
│ Layer 7: Monitoring & Incident Response                 │
│ • 24/7 monitoring • Intrusion detection • SIEM          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 6: Audit & Logging                                │
│ • Audit trails • Log aggregation • Compliance reports   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 5: Data Security                                  │
│ • Encryption at rest • Encryption in transit            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Application Security                           │
│ • Input validation • Output encoding • CSRF tokens      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Authentication & Authorization                 │
│ • JWT tokens • RBAC • Session management                │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Network Security                               │
│ • WAF • Rate limiting • IP filtering                    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Infrastructure Security                        │
│ • Firewall • DDoS protection • SSL/TLS                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Authentication & Authorization

### Password Requirements

**Minimum Requirements**:
```
✅ Minimum length: 8 characters
✅ At least 1 uppercase letter (A-Z)
✅ At least 1 lowercase letter (a-z)
✅ At least 1 number (0-9)
✅ At least 1 special character (!@#$%^&*)
❌ No common passwords (checked against breach database)
❌ No personal information (name, email, etc.)
```

**Laravel Implementation**:
```php
use Illuminate\Validation\Rules\Password;

Password::min(8)
    ->letters()
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised();
```

### Password Hashing

```php
// Use Laravel's bcrypt (cost factor: 12)
use Illuminate\Support\Facades\Hash;

// Hash password
$hashed = Hash::make($password);

// Verify password
if (Hash::check($password, $hashed)) {
    // Password is correct
}
```

**Never store plaintext passwords!**

---

### Token-Based Authentication (Laravel Sanctum)

**How it works**:
```
1. User logs in with email + password
2. Server validates credentials
3. Server generates bearer token (SHA-256 hash)
4. Client stores token securely
5. Client includes token in all API requests
6. Server validates token on each request
```

**Token Storage (Frontend)**:
```javascript
// ❌ BAD: localStorage (vulnerable to XSS)
localStorage.setItem('token', token);

// ✅ GOOD: httpOnly cookie (protected from XSS)
// Set via server-side Set-Cookie header
Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
```

**Token Configuration**:
```php
// config/sanctum.php
'expiration' => 60 * 24, // 24 hours
'token_prefix' => 'lzs_', // Custom prefix
```

---

### Role-Based Access Control (RBAC)

**User Roles**:
| Role | Permissions | Use Case |
|------|-------------|----------|
| **payer_individual** | View profile, calculate zakat, make payments, view history | Individual payers |
| **payer_company** | Same as individual + manage employees | Corporate payers |
| **amil** | Collect payments, view commissions, access assigned area | Field collectors |
| **admin** | Full access, manage users, view reports, export data | LZS staff |
| **super_admin** | All admin + system settings, user management | System administrators |

**Laravel Implementation**:
```php
// Middleware
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});

// Policy
public function viewAny(User $user)
{
    return $user->role === 'admin' || $user->role === 'super_admin';
}

// Blade directive
@can('manage-users')
    <!-- Show admin panel -->
@endcan
```

---

### Two-Factor Authentication (2FA) - Optional Enhancement

**Implementation**:
```php
use PragmaRX\Google2FA\Google2FA;

// Generate secret
$google2fa = new Google2FA();
$secret = $google2fa->generateSecretKey();

// Verify OTP
$valid = $google2fa->verifyKey($secret, $otp);
```

**Flow**:
```
1. User enables 2FA in settings
2. System generates QR code (Google Authenticator)
3. User scans QR code
4. On login, user enters password + OTP
5. System verifies both before granting access
```

---

## 🔐 Data Protection

### Encryption at Rest

**Sensitive Fields to Encrypt**:
```
✅ Bank account numbers
✅ IC numbers (MyKad) - Already hashed for search
✅ Phone numbers - Partially masked
✅ Email addresses - Partially masked in logs
✅ Payment gateway responses
```

**MySQL Encryption**:
```sql
-- Using MySQL AES encryption
INSERT INTO users (profile_data) VALUES (
    JSON_SET('{}', '$.bank_account', 
        AES_ENCRYPT('1234567890', 'encryption_key'))
);

-- Decrypt when reading
SELECT 
    AES_DECRYPT(JSON_EXTRACT(profile_data, '$.bank_account'), 'encryption_key') 
FROM users;
```

**Laravel Encryption**:
```php
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString($value);

// Decrypt
$decrypted = Crypt::decryptString($encrypted);
```

**Encryption Key Management**:
```bash
# Generate application key
php artisan key:generate

# Store in .env (never commit to git!)
APP_KEY=base64:xxx...

# Rotate keys periodically (every 90 days)
php artisan key:rotate
```

---

### Encryption in Transit (SSL/TLS)

**Requirements**:
```
✅ TLS 1.2 or higher (TLS 1.3 preferred)
✅ Strong cipher suites only
✅ Valid SSL certificate (Let's Encrypt or commercial)
✅ HSTS header enabled
✅ No mixed content (all resources over HTTPS)
```

**Nginx Configuration**:
```nginx
server {
    listen 443 ssl http2;
    server_name api.zakat-selangor.gov.my;

    ssl_certificate /etc/ssl/certs/zakat.crt;
    ssl_certificate_key /etc/ssl/private/zakat.key;
    
    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    
    # HSTS header (force HTTPS for 1 year)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

---

### Data Masking & Anonymization

**Masking Sensitive Data**:
```php
// Mask IC number
function maskIC($ic) {
    return substr($ic, 0, 6) . '****';
}
// 900101011234 → 900101****

// Mask email
function maskEmail($email) {
    $parts = explode('@', $email);
    return substr($parts[0], 0, 2) . '***@' . $parts[1];
}
// user@example.com → us***@example.com

// Mask phone
function maskPhone($phone) {
    return substr($phone, 0, 3) . '****' . substr($phone, -3);
}
// 60123456789 → 601****789
```

**Usage**:
```php
// In API responses (for admin viewing user lists)
return [
    'email' => $this->maskEmail($user->email),
    'mykad' => $this->maskIC($user->mykad_ssm),
    'phone' => $this->maskPhone($user->phone),
];
```

---

## 💳 Payment Security

### PCI-DSS Compliance

**Key Requirements**:
```
✅ Never store full card numbers (if accepting cards)
✅ Never store CVV/CVC codes
✅ Use tokenization for recurring payments
✅ Maintain secure network (firewall)
✅ Encrypt cardholder data transmission
✅ Regularly update and patch systems
✅ Restrict access on need-to-know basis
✅ Assign unique ID to each person with access
✅ Regularly monitor and test networks
✅ Maintain information security policy
```

**Our Approach**:
```
✅ Use trusted payment gateways (FPX, iPay88)
✅ Never handle card data directly (redirect to gateway)
✅ Store only payment reference numbers
✅ Use HTTPS for all payment pages
✅ Implement 3D Secure (card payments)
✅ Fraud detection & monitoring
```

---

### Payment Verification

**Double-entry bookkeeping**:
```php
// 1. Create payment record (pending)
$payment = Payment::create([
    'status' => 'pending',
    'amount' => $amount,
    'ref_no' => $this->generateRefNo(),
]);

// 2. Redirect to gateway
return redirect($gateway->getPaymentUrl($payment));

// 3. Gateway callback
public function callback(Request $request)
{
    // Verify signature
    if (!$this->verifySignature($request)) {
        abort(403, 'Invalid signature');
    }
    
    // Verify amount matches
    if ($request->amount != $payment->amount) {
        Log::critical('Amount mismatch', [
            'expected' => $payment->amount,
            'received' => $request->amount,
        ]);
        abort(400, 'Amount mismatch');
    }
    
    // Update payment status
    $payment->update(['status' => 'success']);
    
    // Generate receipt
    $this->generateReceipt($payment);
}
```

---

### Idempotency

**Prevent duplicate payments**:
```php
// Use unique reference number
$refNo = 'LZS-' . date('Ym') . '-' . str_pad($sequence, 6, '0', STR_PAD_LEFT);

// Check for existing payment
$existing = Payment::where('ref_no', $refNo)->first();
if ($existing) {
    return response()->json([
        'success' => false,
        'error' => 'Duplicate payment reference',
    ], 409);
}

// Use database transaction
DB::transaction(function () use ($data) {
    $payment = Payment::create($data);
    $receipt = Receipt::create(['payment_id' => $payment->id]);
});
```

---

## 🔒 API Security

### Input Validation

**Never trust user input!**

```php
// Laravel validation
public function store(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email|max:255',
        'amount' => 'required|numeric|min:1|max:1000000',
        'zakat_type_id' => 'required|uuid|exists:zakat_types,id',
        'phone' => ['required', 'regex:/^60[0-9]{9,10}$/'],
    ]);
    
    // Use validated data only
    Payment::create($validated);
}
```

**Sanitize output**:
```php
// Escape HTML
{{ $user->name }} // Blade automatically escapes

// JSON encoding
return response()->json([
    'message' => e($message), // Additional escaping if needed
]);
```

---

### SQL Injection Prevention

**✅ ALWAYS use:**
```php
// Eloquent ORM (parameterized queries)
User::where('email', $email)->first();

// Query builder (parameterized)
DB::table('users')->where('email', $email)->get();

// Raw queries with bindings
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

**❌ NEVER use:**
```php
// String concatenation (VULNERABLE!)
DB::select("SELECT * FROM users WHERE email = '$email'");
```

---

### XSS Prevention

**Frontend (Next.js)**:
```jsx
// ✅ GOOD: React automatically escapes
<div>{user.name}</div>

// ❌ BAD: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{__html: user.bio}} />

// ✅ GOOD: If HTML needed, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(user.bio)}} />
```

**Backend**:
```php
// Content Security Policy header
response()->header('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
);
```

---

### CSRF Protection

**Laravel (built-in)**:
```php
// Enable CSRF middleware (enabled by default)
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\VerifyCsrfToken::class,
    ],
];

// Blade forms
<form method="POST">
    @csrf
    <!-- form fields -->
</form>

// AJAX requests
fetch('/api/endpoint', {
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
});
```

---

### Rate Limiting

**Prevent brute force & DDoS**:
```php
// routes/api.php
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Custom rate limits
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
});

// Stricter for sensitive endpoints
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
});
```

**CloudFlare Rate Limiting**:
```
- Block IPs with >100 requests/minute
- Challenge suspicious traffic with CAPTCHA
- Geographic restrictions (if needed)
```

---

## 🏗️ Infrastructure Security

### Server Hardening

**Linux Server**:
```bash
# Update system regularly
apt update && apt upgrade -y

# Configure firewall (UFW)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable

# Disable root login
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Use SSH keys instead of passwords
ssh-keygen -t ed25519 -C "server@zakat.gov.my"

# Install fail2ban (prevent brute force)
apt install fail2ban
systemctl enable fail2ban
```

---

### Docker Security

**Best Practices**:
```dockerfile
# Use official, minimal base images
FROM php:8.2-fpm-alpine

# Run as non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser
USER appuser

# Don't expose unnecessary ports
EXPOSE 9000

# Scan for vulnerabilities
docker scan zakat-api:latest
```

**Docker Compose Security**:
```yaml
services:
  app:
    # Read-only filesystem (except necessary dirs)
    read_only: true
    tmpfs:
      - /tmp
    
    # Limit resources
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    
    # Drop unnecessary capabilities
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

---

### Database Security

**MySQL Configuration**:
```ini
# /etc/mysql/my.cnf
[mysqld]
# Bind to localhost only (use private network in production)
bind-address = 127.0.0.1

# Disable remote root access
skip-networking

# Enable SSL for connections
require_secure_transport = ON

# Log all queries (disable in production for performance)
general_log = 0

# Limit max connections
max_connections = 200

# Set query timeout
max_execution_time = 30000
```

**Database User Privileges**:
```sql
-- Application user (limited privileges)
CREATE USER 'lzs_app'@'localhost' IDENTIFIED BY 'strong_random_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON lzs_zakat_db.* TO 'lzs_app'@'localhost';

-- Read-only user (for reporting)
CREATE USER 'lzs_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON lzs_zakat_db.* TO 'lzs_readonly'@'localhost';

-- Backup user
CREATE USER 'lzs_backup'@'localhost' IDENTIFIED BY 'backup_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON lzs_zakat_db.* TO 'lzs_backup'@'localhost';

-- Remove test databases
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

FLUSH PRIVILEGES;
```

---

### Backup & Disaster Recovery

**Automated Backups**:
```bash
#!/bin/bash
# backup.sh - Daily MySQL backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="lzs_zakat_db"

# Create backup
mysqldump -u lzs_backup -p'backup_password' \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    $DB_NAME | gzip > $BACKUP_DIR/lzs_${DATE}.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/lzs_${DATE}.sql.gz s3://lzs-backups/mysql/

# Keep only last 30 days locally
find $BACKUP_DIR -name "lzs_*.sql.gz" -mtime +30 -delete

# Test backup integrity
gunzip -t $BACKUP_DIR/lzs_${DATE}.sql.gz
if [ $? -eq 0 ]; then
    echo "Backup successful: lzs_${DATE}.sql.gz"
else
    echo "Backup FAILED!" | mail -s "LZS Backup Failed" admin@zakat.gov.my
fi
```

**Cron Job**:
```cron
# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

**Recovery Procedure**:
```bash
# Restore from backup
gunzip < lzs_20251029_020000.sql.gz | mysql -u root -p lzs_zakat_db

# Verify restoration
mysql -u root -p -e "SELECT COUNT(*) FROM lzs_zakat_db.users;"
```

---

## 📜 Compliance Requirements

### 1. Personal Data Protection Act (PDPA) Malaysia

**Requirements**:
```
✅ Obtain user consent before collecting data
✅ Inform users how data will be used
✅ Allow users to access their data
✅ Allow users to correct inaccurate data
✅ Allow users to request data deletion
✅ Implement data retention policy
✅ Notify users of data breaches within 72 hours
```

**Implementation**:
```php
// Privacy consent during registration
$user->privacy_consent = true;
$user->privacy_consent_at = now();

// Data access request
public function exportUserData(User $user)
{
    return [
        'profile' => $user->only(['email', 'full_name', 'phone']),
        'payments' => $user->payments,
        'calculations' => $user->zakatCalculations,
    ];
}

// Data deletion request
public function deleteUserData(User $user)
{
    // Soft delete (for audit purposes)
    $user->delete();
    
    // OR anonymize
    $user->update([
        'email' => 'deleted_' . $user->id . '@deleted.com',
        'full_name' => 'Deleted User',
        'mykad_ssm' => null,
    ]);
}
```

---

### 2. Syariah Compliance

**Requirements**:
```
✅ Transparent zakat calculation methods
✅ Accurate nisab values (updated regularly)
✅ Proper zakat distribution categories (asnaf)
✅ Halal payment methods only
✅ No interest (riba) in transactions
✅ Audit trail for all zakat collections
✅ Annual Syariah audit report
```

---

### 3. ISO 27001 (Information Security Management)

**Key Controls**:
```
✅ Information security policy
✅ Asset management
✅ Access control
✅ Cryptography
✅ Physical security
✅ Operations security
✅ Communications security
✅ Supplier relationships
✅ Incident management
✅ Business continuity
✅ Compliance monitoring
```

---

## ✅ Security Checklist

### Development Phase
- [ ] Code review for security vulnerabilities
- [ ] Static code analysis (PHPStan, Psalm)
- [ ] Dependency vulnerability scanning
- [ ] Unit tests for security features
- [ ] Penetration testing

### Deployment Phase
- [ ] SSL/TLS certificate installed
- [ ] Firewall configured
- [ ] Environment variables secured (.env)
- [ ] Database credentials rotated
- [ ] API keys secured
- [ ] Backup system tested
- [ ] Monitoring & alerting configured

### Ongoing Maintenance
- [ ] Weekly security updates
- [ ] Monthly access review
- [ ] Quarterly penetration testing
- [ ] Annual security audit
- [ ] Regular backup testing
- [ ] Incident response drills
- [ ] Security training for team

---

## 🚨 Incident Response Plan

### 1. Detection & Analysis
```
- Monitor alerts and logs
- Identify incident type and severity
- Determine affected systems
- Assess business impact
```

### 2. Containment
```
- Isolate affected systems
- Prevent further damage
- Preserve evidence
- Document all actions
```

### 3. Eradication
```
- Remove threat/vulnerability
- Patch affected systems
- Update security controls
```

### 4. Recovery
```
- Restore systems from clean backups
- Verify system integrity
- Monitor for recurrence
- Return to normal operations
```

### 5. Post-Incident
```
- Document lessons learned
- Update security policies
- Improve detection mechanisms
- Team debrief
```

---

## 📞 Security Contacts

**Report Security Issues**:
```
Email: security@zakat-selangor.gov.my
PGP Key: [Public key fingerprint]
Response SLA: 24 hours for critical issues
```

---

**Document Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir  
**Classification**: Confidential  
**Next Review Date**: January 29, 2026

