// Test script to verify PayU integration
// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:8000';

async function testPayUIntegration() {
  console.log('🧪 Testing PayU Integration...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthCheck = await fetch(`${BASE_URL}/api/admissions`);
    if (healthCheck.ok) {
      console.log('✅ Server is running\n');
    } else {
      console.log('❌ Server connection failed\n');
      return;
    }

    // Test 2: Create admission with step_3 = true
    console.log('2. Testing CREATE with step_3 = true...');
    const createResponse = await fetch(`${BASE_URL}/api/admissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          first_name: 'Test User',
          email: `test${Date.now()}@example.com`,
          mobile_no: 9876543210,
          step_3: true
        }
      })
    });

    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ CREATE successful');
      console.log('📊 Payment Status:', createData.data?.Payment_Status);
      console.log('📊 Step 3:', createData.data?.step_3);
      console.log('🔗 Checkout Link:', createData.checkoutLink ? 'Generated' : 'Not Generated');
      
      if (createData.checkoutLink) {
        console.log('💳 Transaction ID:', createData.checkoutLink.transactionId);
        console.log('💰 Amount:', createData.checkoutLink.amount);
      }
      console.log('');

      // Test 3: Update existing admission
      const admissionId = createData.data.id;
      console.log(`3. Testing UPDATE admission ${admissionId} with step_3 = true...`);
      
      // First reset step_3 to false
      await fetch(`${BASE_URL}/api/admissions/${admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            step_3: false,
            Payment_Status: 'Pending'
          }
        })
      });

      // Now test setting step_3 to true
      const updateResponse = await fetch(`${BASE_URL}/api/admissions/${admissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            step_3: true
          }
        })
      });

      const updateData = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('✅ UPDATE successful');
        console.log('📊 Payment Status:', updateData.data?.Payment_Status);
        console.log('📊 Step 3:', updateData.data?.step_3);
        console.log('🔗 Checkout Link:', updateData.checkoutLink ? 'Generated' : 'Not Generated');
        
        if (updateData.checkoutLink) {
          console.log('💳 Transaction ID:', updateData.checkoutLink.transactionId);
          console.log('💰 Amount:', updateData.checkoutLink.amount);
          console.log('🏦 PayU URL:', updateData.checkoutLink.checkoutUrl);
        }
        console.log('');
      } else {
        console.log('❌ UPDATE failed:', updateData);
      }

    } else {
      console.log('❌ CREATE failed:', createData);
    }

    // Test 4: Test payment endpoints
    console.log('4. Testing payment endpoints...');
    const paymentResponse = await fetch(`${BASE_URL}/api/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admissionId: 1,
        amount: 1
      })
    });

    if (paymentResponse.ok) {
      const paymentData = await paymentResponse.json();
      console.log('✅ Payment endpoint working');
      console.log('🔗 Checkout URL:', paymentData.checkoutUrl);
      console.log('💳 Transaction ID:', paymentData.data?.txnid);
    } else {
      console.log('❌ Payment endpoint failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPayUIntegration();