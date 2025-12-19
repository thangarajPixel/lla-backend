// Test if Course data is being populated
async function testCourseData() {
  try {
    console.log('🧪 Testing Course data population...');
    
    // Test 1: Get admission to see current Course data
    console.log('\n1. Checking current admission data...');
    const getResponse = await fetch('http://localhost:8000/api/admissions/yjldn38feraccqfjp20ygrhe');
    const getData = await getResponse.json();
    
    if (getData.data) {
      console.log('📊 Current admission data:');
      console.log('- ID:', getData.data.id);
      console.log('- Name:', getData.data.first_name, getData.data.last_name);
      console.log('- Course:', getData.data.Course ? 'Present' : 'Missing');
      if (getData.data.Course) {
        console.log('  - Course ID:', getData.data.Course.id);
        console.log('  - Course Title:', getData.data.Course.title);
        console.log('  - Course Name:', getData.data.Course.Name);
        console.log('  - Total Amount:', getData.data.Course.TotalAmount);
      }
    }

    // Test 2: Update admission to trigger Course population
    console.log('\n2. Testing UPDATE with Course population...');
    const updateResponse = await fetch('http://localhost:8000/api/admissions/yjldn38feraccqfjp20ygrhe', {
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
    
    console.log('📊 Update Response Status:', updateResponse.status);
    
    if (updateData.data) {
      console.log('📊 Updated admission data:');
      console.log('- Course in response:', updateData.data.Course ? 'Present' : 'Missing');
      if (updateData.data.Course) {
        console.log('  - Course ID:', updateData.data.Course.id);
        console.log('  - Course Title:', updateData.data.Course.title);
        console.log('  - Course Name:', updateData.data.Course.Name);
        console.log('  - Total Amount:', updateData.data.Course.TotalAmount);
      }
    }

    if (updateData.success) {
      console.log('\n✅ Payment link response:');
      console.log('- Success:', updateData.success);
      console.log('- Payment Link:', updateData.paymentLink || 'Not generated');
      console.log('- Transaction ID:', updateData.transactionId);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCourseData();