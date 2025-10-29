# 📡 API Specifications

> **Zakat Selangor - RESTful API Documentation**  
> Author: Faiz Nasir  
> Base URL: `https://api.zakat-selangor.gov.my/v1`  
> Version: 1.0.0

---

## 📑 Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Common Responses](#common-responses)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#users-endpoints)
  - [Zakat Types](#zakat-types-endpoints)
  - [Zakat Calculations](#zakat-calculations-endpoints)
  - [Payments](#payments-endpoints)
  - [Receipts](#receipts-endpoints)
  - [Amil](#amil-endpoints)
  - [Reports](#reports-endpoints)
  - [Notifications](#notifications-endpoints)
  - [Audit Logs](#audit-logs-endpoints)

---

## 🎯 API Overview

### Base Information

```yaml
Base URL: https://api.zakat-selangor.gov.my/v1
Protocol: HTTPS only
Format: JSON
Authentication: Bearer Token (Laravel Sanctum)
Character Set: UTF-8
Timezone: Asia/Kuala_Lumpur (UTC+8)
```

### HTTP Methods

| Method | Usage |
|--------|-------|
| `GET` | Retrieve resources |
| `POST` | Create new resources |
| `PUT` | Update entire resources |
| `PATCH` | Partial update |
| `DELETE` | Delete resources |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `204` | No Content - Successful but no data |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid/missing token |
| `403` | Forbidden - No permission |
| `404` | Not Found - Resource doesn't exist |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

---

## 🔐 Authentication

### Login & Get Token

All API requests require authentication using Bearer tokens.

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web_browser"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "Ahmad Rosli",
      "role": "payer_individual"
    },
    "token": "1|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Using the Token

Include the token in all subsequent requests:

```http
GET /api/users/profile
Authorization: Bearer 1|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

---

## 📋 Common Responses

### Success Response Format

```json
{
  "success": true,
  "data": {
    // Resource data here
  },
  "message": "Operation successful"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."],
      "password": ["The password must be at least 8 characters."]
    }
  }
}
```

### Paginated Response Format

```json
{
  "success": true,
  "data": [
    // Array of resources
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "https://api.example.com/users?page=1",
    "last": "https://api.example.com/users?page=7",
    "prev": null,
    "next": "https://api.example.com/users?page=2"
  }
}
```

---

## ⏱️ Rate Limiting

### Limits

| User Type | Limit | Window |
|-----------|-------|--------|
| **Guest** | 60 requests | 1 minute |
| **Authenticated** | 120 requests | 1 minute |
| **Admin** | 300 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1635724800
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

---

## 🔑 Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body**
```json
{
  "role": "payer_individual",
  "email": "user@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "full_name": "Ahmad Bin Ali",
  "phone": "60123456789",
  "mykad_ssm": "900101011234"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "Ahmad Bin Ali",
      "role": "payer_individual",
      "is_verified": false
    }
  },
  "message": "Registration successful. Please check your email for verification."
}
```

---

### Login

```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "device_name": "web_browser"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "Ahmad Bin Ali",
      "role": "payer_individual"
    },
    "token": "1|laravel_sanctum_token_here"
  },
  "message": "Login successful"
}
```

---

### Logout

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Verify Email

```http
POST /api/auth/verify-email
```

**Request Body**
```json
{
  "token": "verification_token_from_email"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request Body**
```json
{
  "email": "user@example.com"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### Reset Password

```http
POST /api/auth/reset-password
```

**Request Body**
```json
{
  "token": "reset_token_from_email",
  "email": "user@example.com",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 Users Endpoints

### Get Current User Profile

```http
GET /api/users/profile
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "role": "payer_individual",
    "email": "user@example.com",
    "phone": "60123456789",
    "mykad_ssm": "900101011234",
    "full_name": "Ahmad Bin Ali",
    "branch_id": null,
    "profile_data": {
      "address": "123 Jalan Merdeka, Shah Alam",
      "occupation": "Engineer"
    },
    "is_verified": true,
    "is_active": true,
    "last_login": "2025-10-29T10:30:00+08:00",
    "created_at": "2025-01-15T09:00:00+08:00"
  }
}
```

---

### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "full_name": "Ahmad Bin Ali",
  "phone": "60123456789",
  "profile_data": {
    "address": "456 Jalan Baru, Petaling Jaya",
    "occupation": "Senior Engineer"
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Ahmad Bin Ali",
    "phone": "60123456789",
    "profile_data": {
      "address": "456 Jalan Baru, Petaling Jaya",
      "occupation": "Senior Engineer"
    }
  },
  "message": "Profile updated successfully"
}
```

---

### Get Payment History

```http
GET /api/users/payment-history?page=1&per_page=15
Authorization: Bearer {token}
```

**Query Parameters**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15, max: 100)
- `status` (optional): Filter by status (pending, success, failed)
- `year` (optional): Filter by year (2025)

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid",
      "amount": 1250.00,
      "status": "success",
      "method": "fpx",
      "ref_no": "LZS-202510-001234",
      "zakat_type": "Zakat Pendapatan",
      "receipt_no": "LZS-202510-001234",
      "paid_at": "2025-10-15T14:30:00+08:00",
      "created_at": "2025-10-15T14:25:00+08:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 25,
    "per_page": 15
  }
}
```

---

## 💰 Zakat Types Endpoints

### Get All Zakat Types

```http
GET /api/zakat-types
```

**Query Parameters**
- `is_active` (optional): Filter active types (true/false)

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "zakat-type-uuid",
      "type": "pendapatan",
      "name": "Zakat Pendapatan",
      "name_en": "Income Zakat",
      "description": "Zakat untuk pendapatan gaji dan upah",
      "nisab": 14624.00,
      "haul_days": 355,
      "rate": 0.0250,
      "formula": {
        "formula": "gross_income * 0.025",
        "conditions": ["income >= nisab", "haul >= 355"]
      },
      "is_active": true,
      "display_order": 1
    }
  ]
}
```

---

### Get Single Zakat Type

```http
GET /api/zakat-types/{id}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "zakat-type-uuid",
    "type": "pendapatan",
    "name": "Zakat Pendapatan",
    "nisab": 14624.00,
    "rate": 0.0250,
    "formula": {
      "formula": "gross_income * 0.025"
    }
  }
}
```

---

## 🧮 Zakat Calculations Endpoints

### Calculate Zakat

```http
POST /api/zakat/calculate
Authorization: Bearer {token}
```

**Request Body (Zakat Pendapatan)**
```json
{
  "zakat_type_id": "zakat-type-uuid",
  "amount_gross": 60000.00,
  "deductions": {
    "epf": 6600.00,
    "socso": 1200.00,
    "zakat_selangor": 0
  },
  "haul_start_date": "2024-10-29"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "calculation-uuid",
    "zakat_type": "Zakat Pendapatan",
    "amount_gross": 60000.00,
    "amount_deductions": 7800.00,
    "amount_net": 52200.00,
    "zakat_due": 1305.00,
    "status": "wajib",
    "nisab": 14624.00,
    "haul_remaining_days": 355,
    "breakdown": {
      "monthly_income": 5000.00,
      "annual_income": 60000.00,
      "total_deductions": 7800.00,
      "taxable_income": 52200.00,
      "zakat_rate": 0.025,
      "zakat_amount": 1305.00
    }
  },
  "message": "Zakat calculated successfully"
}
```

---

### Get Calculation History

```http
GET /api/zakat/calculations
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "calculation-uuid",
      "zakat_type": "Zakat Pendapatan",
      "amount_gross": 60000.00,
      "zakat_due": 1305.00,
      "status": "wajib",
      "created_at": "2025-10-29T10:00:00+08:00"
    }
  ]
}
```

---

## 💳 Payments Endpoints

### Initiate Payment

```http
POST /api/payments/initiate
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "zakat_type_id": "zakat-type-uuid",
  "zakat_calc_id": "calculation-uuid",
  "amount": 1305.00,
  "method": "fpx",
  "bank_code": "MBB0227" // For FPX
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "payment_id": "payment-uuid",
    "ref_no": "LZS-202510-001235",
    "amount": 1305.00,
    "method": "fpx",
    "status": "pending",
    "gateway_url": "https://fpx.gateway.com/pay?token=xxx",
    "expires_at": "2025-10-29T11:00:00+08:00"
  },
  "message": "Payment initiated. Redirect to gateway URL."
}
```

---

### Payment Callback (Gateway)

```http
POST /api/payments/callback/{gateway}
```

**This endpoint is called by the payment gateway, not by clients.**

---

### Get Payment Status

```http
GET /api/payments/{ref_no}
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "ref_no": "LZS-202510-001235",
    "amount": 1305.00,
    "status": "success",
    "method": "fpx",
    "zakat_type": "Zakat Pendapatan",
    "paid_at": "2025-10-29T10:35:00+08:00",
    "receipt": {
      "receipt_no": "LZS-202510-001235",
      "pdf_url": "https://storage.zakat.gov.my/receipts/xxx.pdf"
    }
  }
}
```

---

### Request Refund

```http
POST /api/payments/{id}/refund
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "reason": "Duplicate payment",
  "bank_account": "1234567890",
  "bank_name": "Maybank"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "refund_id": "refund-uuid",
    "payment_id": "payment-uuid",
    "amount": 1305.00,
    "status": "pending",
    "estimated_completion": "2025-11-05"
  },
  "message": "Refund request submitted. Processing within 5-7 working days."
}
```

---

## 🧾 Receipts Endpoints

### Get Receipt

```http
GET /api/receipts/{receipt_no}
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "receipt-uuid",
    "receipt_no": "LZS-202510-001235",
    "payment": {
      "ref_no": "LZS-202510-001235",
      "amount": 1305.00,
      "zakat_type": "Zakat Pendapatan",
      "paid_at": "2025-10-29T10:35:00+08:00"
    },
    "payer": {
      "full_name": "Ahmad Bin Ali",
      "mykad_ssm": "900101011234",
      "email": "user@example.com"
    },
    "pdf_url": "https://storage.zakat.gov.my/receipts/LZS-202510-001235.pdf",
    "qr_code": "data:image/png;base64,iVBOR...",
    "valid_until": "2035-10-29T23:59:59+08:00",
    "created_at": "2025-10-29T10:35:05+08:00"
  }
}
```

---

### Download Receipt PDF

```http
GET /api/receipts/{receipt_no}/download
Authorization: Bearer {token}
```

**Response: 200 OK**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="LZS-202510-001235.pdf"

[PDF binary data]
```

---

## 👨‍💼 Amil Endpoints

### Amil Dashboard

```http
GET /api/amil/dashboard
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_collections": 125,
      "total_amount": 156250.00,
      "total_commission": 3125.00,
      "paid_commission": 2500.00,
      "pending_commission": 625.00
    },
    "monthly_performance": [
      {
        "month": "2025-10",
        "collections": 45,
        "amount": 56250.00,
        "commission": 1125.00
      }
    ],
    "recent_collections": [
      {
        "ref_no": "LZS-202510-001235",
        "amount": 1305.00,
        "paid_at": "2025-10-29T10:35:00+08:00"
      }
    ]
  }
}
```

---

### Collect Payment (Amil)

```http
POST /api/amil/collect-payment
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "payer_id": "user-uuid",
  "zakat_type_id": "zakat-type-uuid",
  "amount": 1000.00,
  "method": "cash",
  "location": {
    "latitude": 3.0738,
    "longitude": 101.5183,
    "address": "Masjid Shah Alam"
  }
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "payment_id": "payment-uuid",
    "ref_no": "LZS-202510-001236",
    "amount": 1000.00,
    "commission": 20.00,
    "receipt_no": "LZS-202510-001236"
  },
  "message": "Payment collected successfully"
}
```

---

### Get Commission History

```http
GET /api/amil/commissions
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "commission-uuid",
      "payment_ref": "LZS-202510-001235",
      "amount": 26.10,
      "rate": 0.02,
      "is_paid": true,
      "paid_at": "2025-10-25T15:00:00+08:00",
      "created_at": "2025-10-15T10:35:00+08:00"
    }
  ],
  "summary": {
    "total_earned": 3125.00,
    "total_paid": 2500.00,
    "total_pending": 625.00
  }
}
```

---

## 📊 Reports Endpoints

### Dashboard Summary

```http
GET /api/reports/dashboard
Authorization: Bearer {token} (Admin only)
```

**Query Parameters**
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "total_collection": 1562500.00,
    "total_transactions": 1250,
    "success_rate": 98.5,
    "by_zakat_type": [
      {
        "type": "Zakat Pendapatan",
        "count": 850,
        "amount": 1062500.00
      }
    ],
    "by_payment_method": [
      {
        "method": "fpx",
        "count": 920,
        "amount": 1250000.00
      }
    ],
    "top_amil": [
      {
        "amil_name": "Ali bin Ahmad",
        "collections": 45,
        "amount": 56250.00
      }
    ]
  }
}
```

---

### Export Report

```http
GET /api/reports/export/{type}
Authorization: Bearer {token} (Admin only)
```

**Path Parameters**
- `type`: pdf | excel | csv

**Query Parameters**
- `date_from`: Start date
- `date_to`: End date
- `report_type`: daily_summary | amil_performance | payment_history

**Response: 200 OK**
```
Content-Type: application/pdf (or application/vnd.ms-excel)
Content-Disposition: attachment; filename="report-2025-10.pdf"

[File binary data]
```

---

## 🔔 Notifications Endpoints

### Get Notifications

```http
GET /api/notifications
Authorization: Bearer {token}
```

**Query Parameters**
- `is_read` (optional): Filter by read status (true/false)
- `page` (optional): Page number

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid",
      "type": "payment_success",
      "title": "Payment Successful",
      "message": "Your payment of RM 1,305.00 has been received.",
      "is_read": false,
      "created_at": "2025-10-29T10:35:10+08:00"
    }
  ],
  "unread_count": 3
}
```

---

### Mark as Read

```http
POST /api/notifications/{id}/read
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 📝 Audit Logs Endpoints

### Get Audit Logs (Admin)

```http
GET /api/audit-logs
Authorization: Bearer {token} (Admin only)
```

**Query Parameters**
- `table_name` (optional): Filter by table
- `action` (optional): Filter by action (INSERT, UPDATE, DELETE)
- `user_id` (optional): Filter by user
- `date_from` (optional): Start date
- `date_to` (optional): End date

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "table_name": "payments",
      "record_id": "payment-uuid",
      "user_id": "user-uuid",
      "action": "UPDATE",
      "old_data": {
        "status": "pending"
      },
      "new_data": {
        "status": "success"
      },
      "ip_address": "203.0.113.1",
      "created_at": "2025-10-29T10:35:00+08:00"
    }
  ]
}
```

---

## 🔧 Error Codes Reference

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 422 |
| `UNAUTHORIZED` | Invalid or missing token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `DUPLICATE_ENTRY` | Resource already exists | 409 |
| `PAYMENT_FAILED` | Payment processing failed | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `SERVER_ERROR` | Internal server error | 500 |

---

## 📌 Notes

### Best Practices

1. **Always use HTTPS** - Never send requests over HTTP
2. **Store tokens securely** - Use httpOnly cookies or secure storage
3. **Handle errors gracefully** - Check `success` field before accessing `data`
4. **Respect rate limits** - Implement exponential backoff
5. **Use pagination** - Don't fetch all records at once
6. **Validate inputs** - Client-side validation before API calls

```

---

**API Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir  

