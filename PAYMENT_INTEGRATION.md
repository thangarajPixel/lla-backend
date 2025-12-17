# PayU Payment Integration for Light and Life Academy

## Overview
This integration allows students to pay their admission fees through PayU payment gateway. The system handles payment creation, processing, and status updates automatically.

## Features
- ✅ PayU payment gateway integration
- ✅ Automatic admission status updates
- ✅ Payment success/failure handling
- ✅ Webhook support for payment notifications
- ✅ Default amount of ₹1 for testing
- ✅ Payment link generation for admissions
- ✅ Secure hash verification

## API Endpoints

### Payment APIs
- `POST /api/payment/create` - Create payment link
- `POST /api/payment/success` - Handle payment success callback
- `POST /api/payment/failure` - Handle payment failure callback
- `POST /api/payment/webhook` - Handle PayU webhooks

### Admission APIs
- `POST /api/admissions/:id/payment-link` - Generate payment link for admission

## Configuration

### Environment Variables (.env)
```env
# PayU Configuration
PAYU_KEY=PIujuyTq
PAYU_SALT=KuoFYxzq8F
PAYU_BASE_URL=https://test.payu.in/_payment
PAYU_SUCCESS_URL=http://localhost:8000/api/payment/success
PAYU_FAILURE_URL=http://localhost:8000/api/payment/failure

# Frontend URLs
FRONTEND_URL=https://dev.lightandlifeacademy.in
ADMIN_BASE_URL=https://dev-admin.lightandlifeacademy.in
ADMISSION_VIEW_URL=https://dev.lightandlifeacademy.in

# Default Payment Amount (in rupees)
DEFAULT_PAYMENT_AMOUNT=1
```

## Testing

### Test Pages
1. **Payment Form**: `/payment-form.html` - Simple payment form
2. **Test Suite**: `/test-payment.html` - Complete testing interface
3. **Success Page**: `/payment-success.html` - Payment success page
4. **Failure Page**: `/payment-failed.html` - Payment failure page

### Test Flow
1. Open `/test-payment.html` in browser
2. Enter admission ID (e.g., 1)
3. Set amount (default: ₹1)
4. Click "Generate Payment Link"
5. Proceed to PayU gateway
6. Use test credentials for payment
7. Verify status update in admission record

## Payment Flow

### 1. Payment Creation
```javascript
// Create payment link
POST /api/payment/create
{
  "admissionId": 1,
  "amount": 1
}
```

### 2. PayU Redirect
- User is redirected to PayU gateway
- PayU processes the payment
- User completes payment on PayU

### 3. Callback Handling
- Success: `POST /api/payment/success`
- Failure: `POST /api/payment/failure`
- Updates admission `Payment_Status` field
- Sets `step_3: true` on successful payment

### 4. Status Updates
- **Pending**: Payment link generated
- **Completed**: Payment successful
- **UnPaid**: Payment failed
- **Paid**: Alternative success status

## Database Schema

### Admission Model Updates
The admission model includes:
```json
{
  "Payment_Status": {
    "type": "enumeration",
    "default": "Pending",
    "enum": ["Paid", "Completed", "Pending", "UnPaid"]
  },
  "step_3": {
    "type": "boolean",
    "default": false
  }
}
```

## Security Features
- Hash verification for all PayU callbacks
- Encrypted admission IDs in URLs
- Secure transaction ID generation
- Input validation and sanitization

## Production Setup

### 1. Update PayU Configuration
```env
PAYU_KEY=your_production_key
PAYU_SALT=your_production_salt
PAYU_BASE_URL=https://secure.payu.in/_payment
```

### 2. Update Callback URLs
```env
PAYU_SUCCESS_URL=https://yourdomain.com/api/payment/success
PAYU_FAILURE_URL=https://yourdomain.com/api/payment/failure
```

### 3. Set Production Amount
```env
DEFAULT_PAYMENT_AMOUNT=50000  # ₹50,000 or your actual fee
```

## Troubleshooting

### Common Issues
1. **Hash Mismatch**: Check PAYU_SALT configuration
2. **Payment Not Updating**: Verify callback URLs are accessible
3. **Admission Not Found**: Ensure admission ID exists in database

### Logs
Check Strapi logs for payment processing:
```bash
# Success logs
✅ Payment successful for admission X, transaction: Y

# Error logs
❌ Payment failed for admission X, transaction: Y
```

## Support
For issues or questions, check:
1. Strapi admin logs
2. PayU transaction logs
3. Browser network tab for API calls
4. Database admission records for status updates