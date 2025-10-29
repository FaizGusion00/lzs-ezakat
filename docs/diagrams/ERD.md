# 📊 Entity Relationship Diagram (ERD)

> **Zakat Selangor Database Schema**  
> Author: Faiz Nasir  
> Database: MySQL 8.0+

---

## Interactive ERD Diagram

Copy and paste this code into [Mermaid Live Editor](https://mermaid.live) or GitHub/Notion for interactive visualization.

```mermaid
erDiagram
    BRANCHES ||--o{ USERS : "manages"
    USERS ||--o{ ZAKAT_CALCULATIONS : "calculates"
    USERS ||--o{ PAYMENTS : "pays"
    USERS ||--o{ AMIL_COMMISSIONS : "earns"
    USERS ||--o{ NOTIFICATIONS : "receives"
    ZAKAT_TYPES ||--o{ ZAKAT_CALCULATIONS : "defines"
    ZAKAT_TYPES ||--o{ PAYMENTS : "categorizes"
    ZAKAT_CALCULATIONS ||--o{ PAYMENTS : "triggers"
    PAYMENTS ||--|| RECEIPTS : "generates"
    PAYMENTS ||--o{ AMIL_COMMISSIONS : "commission"
    PAYMENTS ||--o{ AUDIT_LOGS : "tracks"
    
    BRANCHES {
        char_36 id PK "UUID"
        varchar_10 code UK "Unique branch code"
        varchar_255 name "Branch name"
        text address "Full address"
        timestamp created_at
        timestamp updated_at
    }
    
    USERS {
        char_36 id PK "UUID"
        enum role "payer_individual, payer_company, amil"
        varchar_255 email UK "Unique email"
        varchar_20 phone
        varchar_20 mykad_ssm UK "MyKad or SSM number"
        varchar_255 full_name
        char_36 branch_id FK "Reference to branches"
        json profile_data "Flexible profile information"
        boolean is_verified "Email/phone verification"
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }
    
    ZAKAT_TYPES {
        char_36 id PK "UUID"
        enum type UK "pendapatan, perniagaan, emas_perak, etc"
        varchar_255 name "Display name"
        decimal_15_4 nisab "Minimum threshold"
        int haul_days "Days for haul (default 355)"
        json formula "Calculation formula and rules"
        boolean is_active "Active status"
        timestamp created_at
        timestamp updated_at
    }
    
    ZAKAT_CALCULATIONS {
        char_36 id PK "UUID"
        char_36 user_id FK "Reference to users"
        char_36 zakat_type_id FK "Reference to zakat_types"
        decimal_15_4 amount_gross "Gross amount"
        decimal_15_4 amount_net "Net amount after deductions"
        decimal_15_4 zakat_due "Final zakat amount"
        enum status "wajib, sunat, tidak_wajib"
        json params "Calculation parameters"
        int haul_remaining_days "Days until haul complete"
        timestamp created_at
        timestamp updated_at
    }
    
    PAYMENTS {
        char_36 id PK "UUID"
        char_36 user_id FK "Reference to users (payer)"
        char_36 amil_id FK "Reference to users (amil) - nullable"
        char_36 zakat_calc_id FK "Reference to calculation - nullable"
        char_36 zakat_type_id FK "Reference to zakat_types"
        decimal_15_4 amount "Payment amount"
        enum status "pending, success, failed, refunded"
        enum method "fpx, jompay, ewallet, card, qr"
        varchar_100 ref_no UK "Unique payment reference"
        json gateway_response "Payment gateway raw response"
        varchar_7 year_month "For partitioning: YYYY-MM"
        timestamp paid_at "Successful payment timestamp"
        timestamp created_at
        timestamp updated_at
    }
    
    RECEIPTS {
        char_36 id PK "UUID"
        char_36 payment_id FK "Reference to payments - unique"
        varchar_50 receipt_no UK "Unique receipt number"
        text pdf_url "PDF file URL"
        text qr_code "QR code data for verification"
        timestamp valid_until "Receipt validity"
        timestamp created_at
    }
    
    AMIL_COMMISSIONS {
        char_36 id PK "UUID"
        char_36 amil_id FK "Reference to users (amil)"
        char_36 payment_id FK "Reference to payments"
        decimal_15_4 amount "Commission amount"
        decimal_5_4 rate "Commission rate (0.0200 = 2%)"
        boolean is_paid "Payment status"
        timestamp paid_at "Commission payment date"
        timestamp created_at
        timestamp updated_at
    }
    
    AUDIT_LOGS {
        bigint id PK "Auto increment"
        varchar_50 table_name "Target table"
        char_36 record_id "Target record UUID"
        char_36 user_id FK "User who made change"
        enum action "INSERT, UPDATE, DELETE"
        json old_data "Before state"
        json new_data "After state"
        varchar_45 ip_address "User IP"
        text user_agent "Browser/app info"
        timestamp created_at
    }
    
    NOTIFICATIONS {
        char_36 id PK "UUID"
        char_36 user_id FK "Reference to users"
        varchar_50 type "haul_reminder, payment_success, etc"
        text message "Notification content"
        enum channel "whatsapp, email, sms, push"
        boolean is_sent "Delivery status"
        json metadata "Additional data"
        timestamp scheduled_at "When to send"
        timestamp sent_at "When actually sent"
        timestamp created_at
    }
```

---

## 🔗 Relationship Summary

| Parent Table | Child Table | Cardinality | Foreign Key | On Delete | Description |
|--------------|-------------|-------------|-------------|-----------|-------------|
| **branches** | users | 1:N | branch_id | SET NULL | Branch manages multiple users (amil/payers) |
| **users** | zakat_calculations | 1:N | user_id | CASCADE | User can have multiple zakat calculations |
| **users** | payments | 1:N | user_id | RESTRICT | User makes multiple payments (prevent deletion if payments exist) |
| **users** | payments | 1:N | amil_id | SET NULL | Amil can collect multiple payments (optional) |
| **users** | amil_commissions | 1:N | amil_id | CASCADE | Amil earns commissions from payments |
| **users** | notifications | 1:N | user_id | CASCADE | User receives multiple notifications |
| **zakat_types** | zakat_calculations | 1:N | zakat_type_id | RESTRICT | Each calculation belongs to one zakat type |
| **zakat_types** | payments | 1:N | zakat_type_id | RESTRICT | Each payment categorized by zakat type |
| **zakat_calculations** | payments | 1:N | zakat_calc_id | SET NULL | Calculation can trigger payments (optional link) |
| **payments** | receipts | 1:1 | payment_id | CASCADE | Each payment generates one receipt |
| **payments** | amil_commissions | 1:N | payment_id | CASCADE | Payment can have commission for amil |
| **payments** | audit_logs | 1:N | record_id | - | Track all payment changes |

---

## 📐 Design Principles

### 1. **Normalization**
- 3NF (Third Normal Form) compliance
- Minimal data redundancy
- Clear separation of concerns

### 2. **Performance Optimization**
- Strategic indexing on foreign keys and search columns
- Composite indexes for common query patterns
- JSON columns for flexible, non-critical data

### 3. **Data Integrity**
- UUID primary keys for security and distributed systems
- Proper foreign key constraints
- Enum types for controlled values
- NOT NULL constraints where appropriate

### 4. **Audit & Compliance**
- Complete audit trail in `audit_logs`
- Soft deletes capability via `deleted_at` (can be added)
- Timestamp tracking on all tables

### 5. **Scalability**
- Year-month partitioning on payments table
- Efficient indexes for fast queries
- JSON storage for flexible, non-relational data

---

## 🎨 Visual Guidelines

### Color Coding (for tools like dbdiagram.io)

- 🔵 **Blue**: Core entities (users, payments)
- 🟢 **Green**: Master data (branches, zakat_types)
- 🟡 **Yellow**: Transactional (zakat_calculations, receipts)
- 🟠 **Orange**: Supporting (notifications, commissions)
- 🔴 **Red**: Audit & logging

---

## 🔄 Alternative Tools

### dbdiagram.io
Visit [dbdiagram.io](https://dbdiagram.io) and use the DDL from `02-DATABASE-SCHEMA.md` to auto-generate interactive ERD.

### MySQL Workbench
Import the schema SQL file to visualize and reverse-engineer the ERD.

### Draw.io / Lucidchart
For presentation-ready diagrams with custom styling.

---

**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir

