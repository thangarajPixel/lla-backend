# PUT Method - PayU Checkout Link Response

## API Endpoint
```
PUT {{url}}admissions/{{admissionId}}
```

## Request Body
```json
{
  "data": {
    "step_3": true
  }
}
```

## Response with Checkout Link

### Success Response (200)
```json
{
  "data": {
    "id": 1,
    "documentId": "yjldn38feraccqfjp20ygrhe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "mobile_no": 9876543210,
    "Payment_Status": "Pending",
    "step_1": false,
    "step_2": false,
    "step_3": true,
    "createdAt": "2025-12-17T09:30:00.000Z",
    "updatedAt": "2025-12-17T09:35:00.000Z",
    "publishedAt": null
  },
  "checkoutLink": {
    "success": true,
    "checkoutUrl": "https://test.payu.in/_payment",
    "method": "POST",
    "transactionId": "abc123xyz789def456",
    "amount": "1.00",
    "data": {
      "key": "PIujuyTq",
      "txnid": "abc123xyz789def456",
      "amount": "1.00",
      "productinfo": "Admission Fee - Course",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "surl": "http://localhost:8000/api/payment/success",
      "furl": "http://localhost:8000/api/payment/failure",
      "udf1": "1",
      "udf2": "",
      "udf3": "",
      "udf4": "",
      "udf5": "",
      "hash": "generated_sha512_hash_here"
    },
    "admissionInfo": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

## When Checkout Link is Generated

The checkout link is included in the response when:

1. **step_3 is being set to true** (from false to true)
2. **Payment_Status is set to "Pending"** 

## Checkout Link Conditions

```javascript
// Checkout link generated if step_3 is being activated:
const shouldGenerateCheckout = ctx.request.body.data?.step_3 === true && currentAdmission?.step_3 !== true;

if (shouldGenerateCheckout) {
  // Generate checkout link BEFORE setting Payment_Status to "Completed"
}
```

## Flow Explanation

1. **User sets step_3 = true** via PUT request
2. **Checkout link is generated** (with Payment_Status temporarily set to "Pending" for link generation)
3. **Payment processing is triggered** automatically
4. **Payment_Status is set to "Completed"** and **step_3 remains true**
5. **Response includes both** the updated admission data AND the checkout link

## Test Scenarios

### 1. Set Step 3 to True
```bash
PUT /api/admissions/1
{
  "data": {
    "step_3": true
  }
}
```
**Result**: Returns checkout link if payment not completed

### 2. Set Payment Status to Pending
```bash
PUT /api/admissions/1
{
  "data": {
    "Payment_Status": "Pending"
  }
}
```
**Result**: Returns checkout link

### 3. Set Both Fields
```bash
PUT /api/admissions/1
{
  "data": {
    "step_3": true,
    "Payment_Status": "Pending"
  }
}
```
**Result**: Returns checkout link

## Frontend Usage

```javascript
// Make PUT request
const response = await fetch('/api/admissions/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: { step_3: true }
  })
});

const data = await response.json();

// Check if checkout link is available
if (data.checkoutLink) {
  // Redirect to PayU
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = data.checkoutLink.checkoutUrl;
  
  Object.keys(data.checkoutLink.data).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data.checkoutLink.data[key];
    form.appendChild(input);
  });
  
  document.body.appendChild(form);
  form.submit();
}
```

## Test Page

Open: `http://localhost:8000/test-put-checkout.html`

This page allows you to test the PUT method and see the checkout link response in action.

## Console Logs

Check Strapi console for detailed logs:
```
========================================
📝 UPDATE API called
Admission ID: 1
🔗 Generating checkout link for admission: 1
✅ Checkout link generated successfully
========================================
```