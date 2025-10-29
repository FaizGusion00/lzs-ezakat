sequenceDiagram
  participant U as User
  participant FE as Frontend (Next.js)
  participant API as Backend API (Laravel)
  participant DB as Database (MySQL)
  participant GW as Payment Gateway
  participant Q as Queue (Redis)
  participant N as Notifier (Email/SMS/WA)

  U->>FE: Click "Pay Now"
  FE->>API: POST /payments/initiate
  API->>DB: Create Payment (status=pending)
  DB-->>API: Payment Created + ref_no
  API->>GW: Create Transaction + Signature
  GW-->>API: Payment URL / Token
  API-->>FE: Return gateway_url + ref_no
  FE->>U: Redirect to Gateway

  U->>GW: Authorize Payment
  GW->>API: Callback (status=success/failed) + signature
  API->>API: Verify Signature & Amount
  alt Success
    API->>DB: Update Payment (status=success, paid_at)
    API->>DB: Create Receipt (1:1)
    API->>Q: Enqueue Notifications
    Q->>N: Send Email/SMS/WhatsApp
  else Failed
    API->>DB: Update Payment (status=failed, reason)
  end
  API-->>GW: 200 Acknowledged
  FE->>API: GET /payments/{ref_no}
  API-->>FE: Payment + Receipt Details
  FE->>U: Show Result Page