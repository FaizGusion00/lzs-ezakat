stateDiagram-v2
  [*] --> Pending : Initiated
  Pending --> Processing : Gateway Redirect/Callback
  Processing --> Success : Confirmed by Gateway
  Processing --> Failed : Declined/Timeout/Error
  Success --> Refunded : Admin/User Refund
  Refunded --> [*]
  Failed --> [*]
  Success --> [*]

  note right of Success
    Receipt generated
    Notifications sent
    Commission computed
  end note
