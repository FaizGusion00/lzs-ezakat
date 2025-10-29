erDiagram
  BRANCHES ||--o{ USERS : assigns
  USERS ||--o{ ZAKAT_CALCULATIONS : calculates
  USERS ||--o{ PAYMENTS : pays
  USERS ||--o{ AMIL_COMMISSIONS : earns
  USERS ||--o{ NOTIFICATIONS : receives
  ZAKAT_TYPES ||--o{ ZAKAT_CALCULATIONS : defines
  ZAKAT_TYPES ||--o{ PAYMENTS : categorizes
  ZAKAT_CALCULATIONS ||--o{ PAYMENTS : triggers
  PAYMENTS ||--|| RECEIPTS : generates
  PAYMENTS ||--o{ AMIL_COMMISSIONS : commissions
  PAYMENTS ||--o{ AUDIT_LOGS : audits

  BRANCHES {
    string id PK
    string code
    string name
    string address
    datetime created_at
    datetime updated_at
  }

  USERS {
    string id PK
    string role
    string email
    string phone
    string mykad_ssm
    string full_name
    string branch_id FK
    boolean is_verified
    boolean is_active
    datetime last_login
    datetime created_at
    datetime updated_at
  }

  ZAKAT_TYPES {
    string id PK
    string type
    string name
    float nisab
    int haul_days
    boolean is_active
    datetime created_at
    datetime updated_at
  }

  ZAKAT_CALCULATIONS {
    string id PK
    string user_id FK
    string zakat_type_id FK
    float amount_gross
    float amount_net
    float zakat_due
    string status
    int haul_remaining_days
    datetime created_at
    datetime updated_at
  }

  PAYMENTS {
    string id PK
    string user_id FK
    string amil_id FK
    string zakat_calc_id FK
    string zakat_type_id FK
    float amount
    string status
    string method
    string ref_no
    string year_month
    datetime paid_at
    datetime created_at
    datetime updated_at
  }

  RECEIPTS {
    string id PK
    string payment_id FK
    string receipt_no
    string pdf_url
    string qr_code
    datetime valid_until
    datetime created_at
    datetime updated_at
  }

  AMIL_COMMISSIONS {
    string id PK
    string amil_id FK
    string payment_id FK
    float amount
    float rate
    boolean is_paid
    datetime paid_at
    datetime created_at
    datetime updated_at
  }

  AUDIT_LOGS {
    int id PK
    string table_name
    string record_id
    string user_id
    string action
    datetime created_at
  }

  NOTIFICATIONS {
    string id PK
    string user_id FK
    string type
    string message
    string channel
    boolean is_sent
    boolean is_read
    datetime scheduled_at
    datetime sent_at
    datetime created_at
    datetime updated_at
  }