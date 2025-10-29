# 🗄️ Database Schema Documentation

> **Zakat Selangor - MySQL Database Design**  
> Author: Faiz Nasir  
> Database Engine: MySQL 8.0+ with InnoDB  
> Character Set: utf8mb4 (full Unicode support including emojis)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Naming Conventions](#naming-conventions)
- [Complete DDL Scripts](#complete-ddl-scripts)
- [Indexes Strategy](#indexes-strategy)
- [Views & Stored Procedures](#views--stored-procedures)
- [Triggers & Automation](#triggers--automation)
- [Performance Optimization](#performance-optimization)

---

## 🎯 Overview

### Database Statistics (Estimated)

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Tables** | 9 core tables | Normalized, 3NF compliant |
| **Expected Storage (1M txns)** | ~800MB | With indexes |
| **Average Query Time** | <20ms | With proper indexing |
| **Concurrent Users** | 10,000+ | With connection pooling |
| **Backup Strategy** | Daily full + hourly incremental | Retention: 30 days |

---

## 📏 Naming Conventions

```
✅ Tables: plural, snake_case (users, payments)
✅ Columns: snake_case (created_at, user_id)
✅ Indexes: idx_{table}_{columns} (idx_users_email)
✅ Foreign Keys: fk_{table}_{ref_table} (fk_payments_users)
✅ Primary Keys: Always 'id' (UUID char(36))
✅ Enums: descriptive values (payer_individual, not 'pi')
```

---

## 📝 Complete DDL Scripts

### Database Initialization

```sql
-- Create database with proper character set
CREATE DATABASE IF NOT EXISTS lzs_zakat_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lzs_zakat_db;

-- Enable event scheduler for automated tasks
SET GLOBAL event_scheduler = ON;
```

---

### 🏢 1. Branches Table

```sql
CREATE TABLE branches (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    code VARCHAR(10) NOT NULL UNIQUE COMMENT 'Unique branch code (e.g., SEL001)',
    name VARCHAR(255) NOT NULL COMMENT 'Branch name',
    address TEXT COMMENT 'Full branch address',
    phone VARCHAR(20) COMMENT 'Contact number',
    email VARCHAR(255) COMMENT 'Branch email',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_branches_code (code),
    INDEX idx_branches_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Branch/Office locations for LZS';
```

---

### 👥 2. Users Table (Core - Role-Based)

```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    role ENUM('payer_individual', 'payer_company', 'amil', 'admin') NOT NULL COMMENT 'User role',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique email address',
    email_verified_at TIMESTAMP NULL COMMENT 'Email verification timestamp',
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password (bcrypt)',
    phone VARCHAR(20) COMMENT 'Contact number',
    phone_verified_at TIMESTAMP NULL COMMENT 'Phone verification timestamp',
    mykad_ssm VARCHAR(20) UNIQUE COMMENT 'MyKad (IC) for individual, SSM for company',
    full_name VARCHAR(255) NOT NULL COMMENT 'Full name or company name',
    branch_id CHAR(36) COMMENT 'Assigned branch',
    profile_data JSON COMMENT 'Flexible profile data: address, company info, etc.',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Overall verification status',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Account active status',
    last_login TIMESTAMP NULL COMMENT 'Last login timestamp',
    remember_token VARCHAR(100) COMMENT 'Remember me token',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_users_branches FOREIGN KEY (branch_id) 
        REFERENCES branches(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_mykad (mykad_ssm),
    INDEX idx_users_role (role),
    INDEX idx_users_branch (branch_id),
    INDEX idx_users_active (is_active),
    INDEX idx_users_role_branch_created (role, branch_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='All system users: payers, amil, and admins';
```

---

### 💰 3. Zakat Types (Master Data)

```sql
CREATE TABLE zakat_types (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    type ENUM(
        'pendapatan',
        'perniagaan', 
        'emas_perak',
        'simpanan',
        'saham',
        'takaful',
        'pertanian',
        'ternakan',
        'lain'
    ) NOT NULL UNIQUE COMMENT 'Zakat category type',
    name VARCHAR(255) NOT NULL COMMENT 'Display name (Malay)',
    name_en VARCHAR(255) COMMENT 'Display name (English)',
    description TEXT COMMENT 'Description and guidelines',
    nisab DECIMAL(15,4) COMMENT 'Minimum threshold (RM)',
    haul_days INT DEFAULT 355 COMMENT 'Haul period in days (Islamic calendar)',
    rate DECIMAL(5,4) DEFAULT 0.0250 COMMENT 'Zakat rate (2.5% = 0.0250)',
    formula JSON COMMENT 'Calculation formula and conditions',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active status',
    display_order INT DEFAULT 0 COMMENT 'Display order in UI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_zakat_types_active (is_active),
    INDEX idx_zakat_types_type (type),
    INDEX idx_zakat_types_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Master data for zakat types and calculation rules';
```

---

### 🧮 4. Zakat Calculations

```sql
CREATE TABLE zakat_calculations (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL COMMENT 'Reference to users (payer)',
    zakat_type_id CHAR(36) NOT NULL COMMENT 'Reference to zakat type',
    amount_gross DECIMAL(15,4) NOT NULL COMMENT 'Gross amount before deductions',
    amount_deductions DECIMAL(15,4) DEFAULT 0 COMMENT 'Total deductions',
    amount_net DECIMAL(15,4) NOT NULL COMMENT 'Net amount after deductions',
    zakat_due DECIMAL(15,4) NOT NULL COMMENT 'Final zakat amount payable',
    status ENUM('wajib', 'sunat', 'tidak_wajib') NOT NULL COMMENT 'Obligation status',
    params JSON NOT NULL COMMENT 'Calculation parameters and breakdown',
    haul_start_date DATE COMMENT 'Haul start date',
    haul_end_date DATE COMMENT 'Haul completion date',
    haul_remaining_days INT COMMENT 'Days remaining to complete haul',
    notes TEXT COMMENT 'Additional notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_calc_users FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_calc_zakat_types FOREIGN KEY (zakat_type_id)
        REFERENCES zakat_types(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_calc_user (user_id),
    INDEX idx_calc_zakat_type (zakat_type_id),
    INDEX idx_calc_status (status),
    INDEX idx_calc_created (created_at),
    INDEX idx_calc_user_type_date (user_id, zakat_type_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Zakat calculations history for users';
```

---

### 💳 5. Payments Table (Partitionable)

```sql
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL COMMENT 'Reference to users (payer)',
    amil_id CHAR(36) COMMENT 'Reference to users (amil) - optional',
    zakat_calc_id CHAR(36) COMMENT 'Reference to calculation - optional',
    zakat_type_id CHAR(36) NOT NULL COMMENT 'Reference to zakat type',
    amount DECIMAL(15,4) NOT NULL COMMENT 'Payment amount',
    status ENUM('pending', 'processing', 'success', 'failed', 'refunded', 'cancelled') 
        NOT NULL DEFAULT 'pending' COMMENT 'Payment status',
    method ENUM('fpx', 'jompay', 'ewallet', 'card', 'qr', 'cash', 'bank_transfer') 
        NOT NULL COMMENT 'Payment method',
    ref_no VARCHAR(100) UNIQUE COMMENT 'Unique payment reference number',
    gateway_ref VARCHAR(255) COMMENT 'Payment gateway reference',
    gateway_response JSON COMMENT 'Full gateway response data',
    payment_year INT NOT NULL COMMENT 'Payment year for reporting',
    payment_month TINYINT NOT NULL COMMENT 'Payment month (1-12)',
    year_month VARCHAR(7) NOT NULL COMMENT 'YYYY-MM format for partitioning',
    paid_at TIMESTAMP NULL COMMENT 'Successful payment timestamp',
    failed_reason TEXT COMMENT 'Failure reason if applicable',
    ip_address VARCHAR(45) COMMENT 'Payer IP address',
    user_agent TEXT COMMENT 'Browser/app user agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_payments_users FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payments_amil FOREIGN KEY (amil_id)
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_payments_calc FOREIGN KEY (zakat_calc_id)
        REFERENCES zakat_calculations(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_payments_zakat_types FOREIGN KEY (zakat_type_id)
        REFERENCES zakat_types(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_amil (amil_id),
    INDEX idx_payments_zakat_type (zakat_type_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_method (method),
    INDEX idx_payments_ref (ref_no),
    INDEX idx_payments_year_month (year_month),
    INDEX idx_payments_created (created_at),
    INDEX idx_payments_user_status_date (user_id, status, created_at),
    INDEX idx_payments_status_method (status, method),
    INDEX idx_payments_year_month_status (payment_year, payment_month, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='All payment transactions';
```

---

### 🧾 6. Receipts Table

```sql
CREATE TABLE receipts (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    payment_id CHAR(36) NOT NULL UNIQUE COMMENT 'Reference to payment (1:1)',
    receipt_no VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique receipt number (e.g., LZS-2025-001234)',
    pdf_path VARCHAR(500) COMMENT 'PDF file storage path',
    pdf_url TEXT COMMENT 'PDF public URL',
    qr_code TEXT COMMENT 'QR code data for verification',
    valid_until TIMESTAMP COMMENT 'Receipt validity period',
    is_printed BOOLEAN DEFAULT FALSE COMMENT 'Has been printed',
    print_count INT DEFAULT 0 COMMENT 'Number of times printed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_receipts_payments FOREIGN KEY (payment_id)
        REFERENCES payments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_receipts_payment (payment_id),
    INDEX idx_receipts_no (receipt_no),
    INDEX idx_receipts_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Payment receipts';
```

---

### 💵 7. Amil Commissions Table

```sql
CREATE TABLE amil_commissions (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    amil_id CHAR(36) NOT NULL COMMENT 'Reference to users (amil)',
    payment_id CHAR(36) NOT NULL COMMENT 'Reference to payment',
    amount DECIMAL(15,4) NOT NULL COMMENT 'Commission amount',
    rate DECIMAL(5,4) NOT NULL COMMENT 'Commission rate (e.g., 0.0200 = 2%)',
    is_paid BOOLEAN DEFAULT FALSE COMMENT 'Commission paid status',
    paid_at TIMESTAMP NULL COMMENT 'Commission payment date',
    paid_by CHAR(36) COMMENT 'Admin who processed payment',
    payment_method VARCHAR(50) COMMENT 'How commission was paid',
    payment_ref VARCHAR(100) COMMENT 'Commission payment reference',
    notes TEXT COMMENT 'Additional notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_comm_amil FOREIGN KEY (amil_id)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comm_payment FOREIGN KEY (payment_id)
        REFERENCES payments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_comm_amil (amil_id),
    INDEX idx_comm_payment (payment_id),
    INDEX idx_comm_paid (is_paid),
    INDEX idx_comm_amil_date (amil_id, created_at),
    INDEX idx_comm_amil_paid (amil_id, is_paid, paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Commission payments for amil';
```

---

### 📝 8. Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto increment ID',
    table_name VARCHAR(50) NOT NULL COMMENT 'Target table name',
    record_id CHAR(36) NOT NULL COMMENT 'Target record UUID',
    user_id CHAR(36) COMMENT 'User who performed action',
    action ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT') 
        NOT NULL COMMENT 'Action type',
    old_data JSON COMMENT 'Data before change (UPDATE/DELETE)',
    new_data JSON COMMENT 'Data after change (INSERT/UPDATE)',
    ip_address VARCHAR(45) COMMENT 'User IP address',
    user_agent TEXT COMMENT 'Browser/app user agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_audit_table (table_name),
    INDEX idx_audit_record (record_id),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at),
    INDEX idx_audit_table_record_date (table_name, record_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Complete audit trail for all critical operations';
```

---

### 🔔 9. Notifications Table

```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
    user_id CHAR(36) NOT NULL COMMENT 'Reference to users',
    type VARCHAR(50) NOT NULL COMMENT 'Notification type (haul_reminder, payment_success, etc)',
    title VARCHAR(255) COMMENT 'Notification title',
    message TEXT NOT NULL COMMENT 'Notification content',
    channel ENUM('whatsapp', 'email', 'sms', 'push', 'system') 
        NOT NULL COMMENT 'Delivery channel',
    is_sent BOOLEAN DEFAULT FALSE COMMENT 'Delivery status',
    is_read BOOLEAN DEFAULT FALSE COMMENT 'Read status (for in-app)',
    metadata JSON COMMENT 'Additional data (template vars, etc)',
    scheduled_at TIMESTAMP COMMENT 'When to send (for scheduled notifications)',
    sent_at TIMESTAMP NULL COMMENT 'When actually sent',
    failed_reason TEXT COMMENT 'Failure reason if not sent',
    read_at TIMESTAMP NULL COMMENT 'When user read it',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_notif_users FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_type (type),
    INDEX idx_notif_channel (channel),
    INDEX idx_notif_sent (is_sent),
    INDEX idx_notif_scheduled (scheduled_at),
    INDEX idx_notif_user_sent (user_id, is_sent),
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='All system notifications';
```

---

## 📊 Indexes Strategy

### Primary Indexes (Automatically Created)
- All `id` columns: Primary Key with UUID
- Unique constraints: `email`, `mykad_ssm`, `ref_no`, `receipt_no`

### Secondary Indexes (Performance Critical)

```sql
-- Most frequently queried columns
✅ Foreign keys (user_id, branch_id, etc.)
✅ Status fields (is_active, is_paid, status)
✅ Date fields (created_at, scheduled_at, paid_at)
✅ Search fields (email, mykad_ssm, ref_no)

-- Composite indexes for complex queries
✅ (user_id, status, created_at) - User payment history
✅ (role, branch_id, created_at) - Branch reports
✅ (amil_id, is_paid, paid_at) - Commission tracking
```

### Index Monitoring

```sql
-- Check unused indexes
SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'lzs_zakat_db';

-- Check index usage
SELECT * FROM sys.schema_index_statistics WHERE table_schema = 'lzs_zakat_db';
```

---

## 📈 Views & Stored Procedures

### View: Daily Payment Summary

```sql
CREATE OR REPLACE VIEW v_daily_payment_summary AS
SELECT 
    DATE(created_at) AS payment_date,
    zakat_type_id,
    status,
    method,
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount,
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount
FROM payments
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY DATE(created_at), zakat_type_id, status, method;
```

### View: Amil Performance

```sql
CREATE OR REPLACE VIEW v_amil_performance AS
SELECT 
    u.id AS amil_id,
    u.full_name AS amil_name,
    u.branch_id,
    b.name AS branch_name,
    COUNT(DISTINCT p.id) AS total_collections,
    SUM(p.amount) AS total_amount,
    SUM(ac.amount) AS total_commission,
    SUM(CASE WHEN ac.is_paid = TRUE THEN ac.amount ELSE 0 END) AS paid_commission,
    SUM(CASE WHEN ac.is_paid = FALSE THEN ac.amount ELSE 0 END) AS pending_commission,
    DATE(MAX(p.created_at)) AS last_collection_date
FROM users u
LEFT JOIN branches b ON u.branch_id = b.id
LEFT JOIN payments p ON p.amil_id = u.id AND p.status = 'success'
LEFT JOIN amil_commissions ac ON ac.amil_id = u.id
WHERE u.role = 'amil'
GROUP BY u.id, u.full_name, u.branch_id, b.name;
```

### View: User Payment History

```sql
CREATE OR REPLACE VIEW v_user_payment_history AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    u.mykad_ssm,
    zt.name AS zakat_type,
    p.amount,
    p.status,
    p.method,
    p.ref_no,
    r.receipt_no,
    p.paid_at,
    p.created_at
FROM users u
LEFT JOIN payments p ON p.user_id = u.id
LEFT JOIN zakat_types zt ON p.zakat_type_id = zt.id
LEFT JOIN receipts r ON r.payment_id = p.id
WHERE u.role IN ('payer_individual', 'payer_company')
ORDER BY p.created_at DESC;
```

---

## ⚡ Triggers & Automation

### 1. Auto-Generate Receipt on Payment Success

```sql
DELIMITER $$

CREATE TRIGGER trg_auto_generate_receipt
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    -- Only trigger when status changes to 'success' and no receipt exists yet
    IF NEW.status = 'success' AND OLD.status != 'success' THEN
        -- Check if receipt doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM receipts WHERE payment_id = NEW.id) THEN
            INSERT INTO receipts (
                id,
                payment_id,
                receipt_no,
                valid_until,
                created_at
            ) VALUES (
                UUID(),
                NEW.id,
                CONCAT(
                    'LZS-',
                    DATE_FORMAT(NEW.created_at, '%Y%m'),
                    '-',
                    LPAD(
                        (SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_no, -6) AS UNSIGNED)), 0) + 1
                         FROM receipts
                         WHERE receipt_no LIKE CONCAT('LZS-', DATE_FORMAT(NEW.created_at, '%Y%m'), '-%')),
                        6, '0'
                    )
                ),
                DATE_ADD(NOW(), INTERVAL 10 YEAR),
                NOW()
            );
        END IF;
    END IF;
END$$

DELIMITER ;
```

### 2. Auto-Calculate Amil Commission

```sql
DELIMITER $$

CREATE TRIGGER trg_auto_amil_commission
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    DECLARE commission_rate DECIMAL(5,4) DEFAULT 0.0200; -- 2% default
    
    -- Only trigger when payment succeeds and amil is assigned
    IF NEW.status = 'success' AND OLD.status != 'success' AND NEW.amil_id IS NOT NULL THEN
        -- Check if commission doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM amil_commissions WHERE payment_id = NEW.id) THEN
            INSERT INTO amil_commissions (
                id,
                amil_id,
                payment_id,
                amount,
                rate,
                created_at
            ) VALUES (
                UUID(),
                NEW.amil_id,
                NEW.id,
                NEW.amount * commission_rate,
                commission_rate,
                NOW()
            );
        END IF;
    END IF;
END$$

DELIMITER ;
```

### 3. Audit Log Trigger (Generic)

```sql
DELIMITER $$

CREATE TRIGGER trg_audit_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        user_id,
        action,
        old_data,
        new_data,
        created_at
    ) VALUES (
        'users',
        NEW.id,
        NEW.id, -- Current user (can be enhanced with session variable)
        'UPDATE',
        JSON_OBJECT(
            'email', OLD.email,
            'full_name', OLD.full_name,
            'is_active', OLD.is_active
        ),
        JSON_OBJECT(
            'email', NEW.email,
            'full_name', NEW.full_name,
            'is_active', NEW.is_active
        ),
        NOW()
    );
END$$

DELIMITER ;
```

### 4. Update year_month on Payment Insert

```sql
DELIMITER $$

CREATE TRIGGER trg_set_payment_year_month
BEFORE INSERT ON payments
FOR EACH ROW
BEGIN
    SET NEW.payment_year = YEAR(NEW.created_at);
    SET NEW.payment_month = MONTH(NEW.created_at);
    SET NEW.year_month = DATE_FORMAT(NEW.created_at, '%Y-%m');
END$$

DELIMITER ;
```

---

## 🚀 Performance Optimization

### 1. Query Optimization Guidelines

```sql
-- ✅ GOOD: Use indexes
SELECT * FROM payments 
WHERE user_id = 'xxx' AND status = 'success'
ORDER BY created_at DESC LIMIT 10;

-- ❌ BAD: Full table scan
SELECT * FROM payments 
WHERE YEAR(created_at) = 2025; -- Use year_month instead

-- ✅ GOOD: Use indexed column
SELECT * FROM payments 
WHERE payment_year = 2025 AND payment_month = 10;
```

### 2. Table Partitioning (Future Enhancement)

```sql
-- Partition payments by year (MySQL 8.0+)
ALTER TABLE payments
PARTITION BY RANGE (payment_year) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### 3. Archival Strategy

```sql
-- Create archive table for old payments (>2 years)
CREATE TABLE payments_archive LIKE payments;

-- Move old data
INSERT INTO payments_archive
SELECT * FROM payments 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Delete from main table
DELETE FROM payments 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```

### 4. Connection Pooling

```
Laravel .env configuration:
DB_CONNECTION_POOL_MIN=5
DB_CONNECTION_POOL_MAX=20
```

---

## 🔒 Security Considerations

### 1. Sensitive Data Encryption

```sql
-- Use MySQL encryption functions
-- Store encrypted data in profile_data JSON
UPDATE users 
SET profile_data = JSON_SET(
    profile_data,
    '$.bank_account',
    AES_ENCRYPT('account_number', 'encryption_key')
);
```

### 2. Prevent SQL Injection

```
✅ Always use Laravel Eloquent ORM or prepared statements
✅ Never concatenate user input into SQL queries
✅ Validate and sanitize all inputs
```

### 3. Database User Privileges

```sql
-- Create application user with limited privileges
CREATE USER 'lzs_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON lzs_zakat_db.* TO 'lzs_app'@'localhost';
FLUSH PRIVILEGES;

-- Read-only user for reporting
CREATE USER 'lzs_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON lzs_zakat_db.* TO 'lzs_readonly'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📦 Sample Seed Data

```sql
-- Insert master branches
INSERT INTO branches (id, code, name, address) VALUES
(UUID(), 'HQ001', 'Pejabat Utama LZS', 'Shah Alam, Selangor'),
(UUID(), 'PKD01', 'Pejabat Daerah Petaling', 'Petaling Jaya, Selangor'),
(UUID(), 'KLG01', 'Pejabat Daerah Klang', 'Klang, Selangor');

-- Insert zakat types
INSERT INTO zakat_types (id, type, name, nisab, rate, formula, is_active) VALUES
(UUID(), 'pendapatan', 'Zakat Pendapatan', 14624.00, 0.0250, 
    '{"formula": "gross_income * 0.025", "conditions": ["income >= nisab", "haul >= 355"]}', TRUE),
(UUID(), 'perniagaan', 'Zakat Perniagaan', 14624.00, 0.0250,
    '{"formula": "(assets - liabilities) * 0.025", "conditions": ["net_worth >= nisab"]}', TRUE),
(UUID(), 'emas_perak', 'Zakat Emas & Perak', NULL, 0.0250,
    '{"nisab_gold_gram": 85, "nisab_silver_gram": 595}', TRUE),
(UUID(), 'simpanan', 'Zakat Simpanan', 14624.00, 0.0250,
    '{"formula": "total_savings * 0.025"}', TRUE);

-- Insert sample admin user
INSERT INTO users (id, role, email, password, full_name, is_verified, is_active) VALUES
(UUID(), 'admin', 'admin@lzs.gov.my', '$2y$10$encrypted_password_here', 'Administrator LZS', TRUE, TRUE);
```

---

## 📋 Maintenance Checklist

### Daily
- [ ] Check slow query log
- [ ] Monitor table sizes
- [ ] Review failed payments

### Weekly
- [ ] Analyze query performance
- [ ] Update table statistics: `ANALYZE TABLE payments, users;`
- [ ] Check index fragmentation

### Monthly
- [ ] Full database backup
- [ ] Review and archive old audit logs
- [ ] Optimize tables: `OPTIMIZE TABLE payments, audit_logs;`
- [ ] Review and update indexes based on usage

---

**Database Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir  

