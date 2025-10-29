# 🔄 System Flow Diagrams

> **Zakat Selangor - Process Flow Documentation**  
> Author: Faiz Nasir  
> Version: 1.0.0

---

## 📑 Table of Contents

- [User Registration Flow](#user-registration-flow)
- [Zakat Calculation Flow](#zakat-calculation-flow)
- [Payment Processing Flow](#payment-processing-flow)
- [Amil Collection Flow](#amil-collection-flow)
- [Receipt Generation Flow](#receipt-generation-flow)
- [Notification Flow](#notification-flow)

---

## 👤 User Registration Flow

### Individual User Registration

```mermaid
flowchart TD
    Start([User visits registration page]) --> Input[Fill registration form<br/>Email, Password, MyKad, Name]
    Input --> Validate{Form validation<br/>passed?}
    
    Validate -->|No| Error1[Show validation errors]
    Error1 --> Input
    
    Validate -->|Yes| CheckEmail{Email already<br/>exists?}
    CheckEmail -->|Yes| Error2[Show 'Email already registered']
    Error2 --> Input
    
    CheckEmail -->|No| CheckIC{MyKad already<br/>exists?}
    CheckIC -->|Yes| Error3[Show 'MyKad already registered']
    Error3 --> Input
    
    CheckIC -->|No| CreateUser[Create user account<br/>is_verified = false]
    CreateUser --> SendEmail[Send verification email]
    SendEmail --> ShowSuccess[Show success message<br/>'Please check your email']
    
    ShowSuccess --> WaitVerify[User clicks verification link]
    WaitVerify --> VerifyToken{Token valid<br/>and not expired?}
    
    VerifyToken -->|No| Error4[Show 'Invalid or expired token']
    VerifyToken -->|Yes| UpdateUser[Update is_verified = true]
    UpdateUser --> Login[Redirect to login page]
    Login --> End([Registration complete])

    style Start fill:#3b82f6
    style End fill:#10b981
    style Error1 fill:#ef4444
    style Error2 fill:#ef4444
    style Error3 fill:#ef4444
    style Error4 fill:#ef4444
```

### Corporate User Registration

```mermaid
flowchart TD
    Start([Company registration]) --> Input[Fill company details<br/>Email, SSM, Company Name]
    Input --> UploadSSM[Upload SSM certificate]
    UploadSSM --> Submit[Submit for verification]
    Submit --> CreateAccount[Create company account<br/>is_verified = false]
    CreateAccount --> AssignReviewer[Assign to admin reviewer]
    AssignReviewer --> AdminReview{Admin reviews<br/>SSM document}
    
    AdminReview -->|Reject| SendRejection[Send rejection email<br/>with reason]
    SendRejection --> End1([Registration rejected])
    
    AdminReview -->|Approve| ApproveAccount[Update is_verified = true]
    ApproveAccount --> SendApproval[Send approval email<br/>with login credentials]
    SendApproval --> End2([Registration approved])
    
    style Start fill:#3b82f6
    style End1 fill:#ef4444
    style End2 fill:#10b981
```

---

## 🧮 Zakat Calculation Flow

### Zakat Pendapatan (Income Zakat)

```mermaid
flowchart TD
    Start([User selects Zakat Pendapatan]) --> Form[Fill calculation form<br/>Monthly/Annual Income<br/>EPF, SOCSO deductions]
    Form --> Validate{Input validation}
    
    Validate -->|Invalid| Error[Show errors]
    Error --> Form
    
    Validate -->|Valid| Calculate[Calculate zakat:<br/>Net Income = Gross - Deductions<br/>Zakat = Net × 2.5%]
    Calculate --> CheckNisab{Net Income >= Nisab<br/>RM 14,624?}
    
    CheckNisab -->|No| StatusTidakWajib[Status: Tidak Wajib<br/>Show message]
    StatusTidakWajib --> SaveCalc1[Save calculation to history]
    SaveCalc1 --> End1([Show result])
    
    CheckNisab -->|Yes| CheckHaul{Haul completed?<br/>355 days}
    
    CheckHaul -->|No| StatusSunat[Status: Sunat<br/>Haul remaining: X days]
    StatusSunat --> SaveCalc2[Save calculation]
    SaveCalc2 --> ShowResult2[Show calculation result<br/>with suggestion]
    ShowResult2 --> End2([Offer to pay early])
    
    CheckHaul -->|Yes| StatusWajib[Status: Wajib<br/>Zakat amount: RM X]
    StatusWajib --> SaveCalc3[Save calculation]
    SaveCalc3 --> ShowResult3[Show calculation result]
    ShowResult3 --> ProceedPayment{User wants<br/>to pay now?}
    
    ProceedPayment -->|No| End3([Save for later])
    ProceedPayment -->|Yes| InitiatePayment[Redirect to payment page]
    InitiatePayment --> End4([Continue to payment])
    
    style Start fill:#3b82f6
    style End1 fill:#94a3b8
    style End2 fill:#f59e0b
    style End3 fill:#94a3b8
    style End4 fill:#10b981
```

---

## 💳 Payment Processing Flow

### Online Payment (FPX/eWallet)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    participant Gateway as Payment Gateway
    participant Queue
    participant Notification

    User->>Frontend: Click 'Pay Now'
    Frontend->>API: POST /api/payments/initiate
    
    API->>DB: Create payment record<br/>(status: pending)
    DB-->>API: Payment created
    
    API->>Gateway: Generate payment URL<br/>with signature
    Gateway-->>API: Return payment URL
    
    API-->>Frontend: Return gateway URL
    Frontend->>User: Redirect to gateway
    
    User->>Gateway: Enter bank credentials/<br/>authorize payment
    Gateway->>Gateway: Process payment
    
    alt Payment Successful
        Gateway->>API: Callback: Success
        API->>API: Verify signature
        API->>DB: Update payment<br/>(status: success)
        API->>DB: Create receipt
        API->>Queue: Dispatch notification job
        Queue->>Notification: Send email/SMS/WhatsApp
        Notification->>User: Receipt notification
        API-->>Gateway: Return success
        Gateway->>User: Show success page
        User->>Frontend: Return to website
        Frontend->>API: GET /api/payments/{ref_no}
        API-->>Frontend: Payment details + receipt
        Frontend->>User: Show success page
    else Payment Failed
        Gateway->>API: Callback: Failed
        API->>DB: Update payment<br/>(status: failed)
        API-->>Gateway: Return acknowledged
        Gateway->>User: Show failure page
        User->>Frontend: Return to website
        Frontend->>User: Show retry option
    end
```

### Payment States

```mermaid
stateDiagram-v2
    [*] --> Pending: Payment initiated
    Pending --> Processing: Gateway processing
    
    Processing --> Success: Payment successful
    Processing --> Failed: Payment failed
    Processing --> Pending: Timeout/retry
    
    Success --> Refunded: Refund requested
    Failed --> [*]: Max retries exceeded
    Refunded --> [*]: Refund completed
    
    Success --> [*]: Transaction complete
    
    note right of Success
        Receipt generated
        Notification sent
        Commission calculated
    end note
    
    note right of Failed
        Error logged
        User notified
        Can retry
    end note
```

---

## 👨‍💼 Amil Collection Flow

### Cash Collection by Amil

```mermaid
flowchart TD
    Start([Amil meets payer]) --> Login[Amil logs in to mobile app]
    Login --> Search{Search payer}
    
    Search -->|Existing user| SelectUser[Select user from list]
    Search -->|New user| RegisterUser[Register new user on-site<br/>with MyKad]
    
    RegisterUser --> SelectUser
    SelectUser --> SelectZakat[Select zakat type<br/>& enter amount]
    SelectZakat --> Validate{Amount valid?}
    
    Validate -->|No| Error[Show error message]
    Error --> SelectZakat
    
    Validate -->|Yes| GPSCheck{GPS location<br/>enabled?}
    
    GPSCheck -->|No| EnableGPS[Prompt to enable GPS]
    EnableGPS --> GPSCheck
    
    GPSCheck -->|Yes| CaptureLocation[Capture GPS coordinates<br/>& timestamp]
    CaptureLocation --> ConfirmCollection[Confirm collection details]
    ConfirmCollection --> CreatePayment[Create payment<br/>method: cash<br/>status: success]
    CreatePayment --> CalcCommission[Calculate amil commission<br/>2% of amount]
    CalcCommission --> GenerateReceipt[Auto-generate receipt]
    GenerateReceipt --> PrintReceipt{Print receipt?}
    
    PrintReceipt -->|Yes| PrintPDF[Print PDF receipt]
    PrintReceipt -->|No| EmailReceipt[Email receipt to payer]
    
    PrintPDF --> SendNotif[Send SMS/WhatsApp<br/>confirmation]
    EmailReceipt --> SendNotif
    
    SendNotif --> UpdateDashboard[Update amil dashboard<br/>with collection stats]
    UpdateDashboard --> End([Collection complete])
    
    style Start fill:#3b82f6
    style End fill:#10b981
    style Error fill:#ef4444
```

---

## 🧾 Receipt Generation Flow

### Automatic Receipt Generation

```mermaid
flowchart TD
    Start([Payment status updated to success]) --> Trigger[Database trigger fires]
    Trigger --> CheckReceipt{Receipt already<br/>exists?}
    
    CheckReceipt -->|Yes| End1([Skip - already generated])
    
    CheckReceipt -->|No| GenerateRefNo[Generate receipt number<br/>LZS-YYYYMM-XXXXXX]
    GenerateRefNo --> CreateRecord[Create receipt record in DB]
    CreateRecord --> QueueJob[Dispatch PDF generation job]
    QueueJob --> FetchData[Fetch payment & user data]
    FetchData --> GeneratePDF[Generate PDF using template<br/>with QR code]
    GeneratePDF --> UploadS3[Upload PDF to S3/MinIO]
    UploadS3 --> UpdateRecord[Update receipt with PDF URL]
    UpdateRecord --> QueueNotif[Queue notification job]
    QueueNotif --> SendEmail[Send email with PDF attachment]
    SendEmail --> End2([Receipt delivered])
    
    style Start fill:#3b82f6
    style End1 fill:#94a3b8
    style End2 fill:#10b981
```

### Receipt Template Structure

```
┌─────────────────────────────────────────────────────────┐
│                 LEMBAGA ZAKAT SELANGOR                  │
│                   Official Receipt                      │
├─────────────────────────────────────────────────────────┤
│ Receipt No:  LZS-202510-001234                          │
│ Date:        29 October 2025, 10:35 AM                  │
│ Reference:   LZS-202510-001234                          │
├─────────────────────────────────────────────────────────┤
│ PAYER INFORMATION                                       │
│ Name:        Ahmad Bin Ali                              │
│ IC/SSM:      900101-01-1234                             │
│ Email:       user@example.com                           │
├─────────────────────────────────────────────────────────┤
│ PAYMENT DETAILS                                         │
│ Zakat Type:  Zakat Pendapatan                           │
│ Amount:      RM 1,305.00                                │
│ Method:      FPX (Maybank)                              │
│ Status:      Paid ✓                                     │
├─────────────────────────────────────────────────────────┤
│ Tax Deduction: This receipt can be used for income      │
│                tax deduction purposes.                  │
│                                                         │
│ [QR CODE]    Scan to verify receipt authenticity        │
│                                                         │
│ Valid until: 29 October 2035                            │
├─────────────────────────────────────────────────────────┤
│ For inquiries, contact: 03-XXXX-XXXX                    │
│ Website: www.zakat-selangor.gov.my                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔔 Notification Flow

### Multi-Channel Notification System

```mermaid
flowchart TD
    Start([Event triggered]) --> CreateNotif[Create notification record<br/>in database]
    CreateNotif --> QueueJob[Dispatch notification job<br/>to queue]
    QueueJob --> DetermineChannel{Determine<br/>channel}
    
    DetermineChannel -->|Email| PrepareEmail[Prepare email template<br/>with variables]
    DetermineChannel -->|SMS| PrepareSMS[Prepare SMS message<br/>max 160 chars]
    DetermineChannel -->|WhatsApp| PrepareWA[Prepare WhatsApp message<br/>with media]
    DetermineChannel -->|Push| PreparePush[Prepare push notification<br/>title + body]
    
    PrepareEmail --> SendEmail[Send via AWS SES/Mailgun]
    PrepareSMS --> SendSMS[Send via Twilio]
    PrepareWA --> SendWA[Send via WhatsApp API]
    PreparePush --> SendPush[Send via FCM/APNS]
    
    SendEmail --> CheckEmail{Delivery<br/>successful?}
    SendSMS --> CheckSMS{Delivery<br/>successful?}
    SendWA --> CheckWA{Delivery<br/>successful?}
    SendPush --> CheckPush{Delivery<br/>successful?}
    
    CheckEmail -->|Yes| UpdateSuccess1[Update is_sent = true<br/>sent_at = now]
    CheckEmail -->|No| UpdateFailed1[Update failed_reason]
    
    CheckSMS -->|Yes| UpdateSuccess2[Update is_sent = true]
    CheckSMS -->|No| UpdateFailed2[Update failed_reason]
    
    CheckWA -->|Yes| UpdateSuccess3[Update is_sent = true]
    CheckWA -->|No| UpdateFailed3[Update failed_reason]
    
    CheckPush -->|Yes| UpdateSuccess4[Update is_sent = true]
    CheckPush -->|No| UpdateFailed4[Update failed_reason]
    
    UpdateSuccess1 --> End([Notification delivered])
    UpdateSuccess2 --> End
    UpdateSuccess3 --> End
    UpdateSuccess4 --> End
    
    UpdateFailed1 --> Retry{Max retries<br/>reached?}
    UpdateFailed2 --> Retry
    UpdateFailed3 --> Retry
    UpdateFailed4 --> Retry
    
    Retry -->|No| QueueRetry[Queue retry after delay]
    QueueRetry --> QueueJob
    
    Retry -->|Yes| LogFailure[Log permanent failure<br/>Alert admin]
    LogFailure --> End
    
    style Start fill:#3b82f6
    style End fill:#10b981
```

### Notification Triggers & Timing

| Event | Channels | Timing | Template |
|-------|----------|--------|----------|
| **Registration** | Email | Immediate | Welcome + verification link |
| **Email Verified** | Email | Immediate | Account activated |
| **Payment Success** | Email, SMS, WhatsApp | Immediate | Receipt + thank you |
| **Payment Failed** | Email, SMS | Immediate | Failure reason + retry link |
| **Haul Reminder** | WhatsApp, Email | 30 days before | "Your zakat is due soon" |
| **Ramadan Campaign** | All channels | Scheduled | Special Ramadan message |
| **Commission Paid** | Email, SMS | Immediate (amil) | Payment confirmation |
| **Receipt Generated** | Email | Immediate | PDF attachment |

---

## 🔍 Audit Trail Flow

```mermaid
flowchart TD
    Start([User action performed]) --> Capture[Capture action details:<br/>User, Table, Record ID<br/>Action, Old/New data]
    Capture --> Trigger[Database trigger fires]
    Trigger --> CreateLog[Insert into audit_logs table]
    CreateLog --> AddMetadata[Add metadata:<br/>IP address, User agent<br/>Timestamp]
    AddMetadata --> CheckSensitive{Contains<br/>sensitive data?}
    
    CheckSensitive -->|Yes| MaskData[Mask sensitive fields<br/>passwords, tokens, etc.]
    CheckSensitive -->|No| StoreLog[Store complete log]
    
    MaskData --> StoreLog
    StoreLog --> IndexLog[Index for fast searching]
    IndexLog --> CheckCritical{Critical action?<br/>DELETE, large UPDATE}
    
    CheckCritical -->|Yes| AlertAdmin[Send alert to admin<br/>via Slack/Email]
    CheckCritical -->|No| End([Log stored])
    
    AlertAdmin --> End
    
    style Start fill:#3b82f6
    style End fill:#10b981
```

---

**Document Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir

