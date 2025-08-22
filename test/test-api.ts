// Test the API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 Testing Thmanyah API\n');

  try {
    // Test welcome endpoint
    console.log('📋 Testing welcome endpoint...');
    const welcomeResponse = await fetch(`${BASE_URL}/`);
    const welcomeData = await welcomeResponse.json();
    console.log('✅ Welcome response:', welcomeData);

    // Test create program endpoint
    console.log('\n📋 Testing create program endpoint...');
    const programData = {
      title: 'TypeScript Mastery Course',
      type: 'podcast',
      slug: 'typescript-mastery-course',
      status: 'draft'
    };

    const createResponse = await fetch(`${BASE_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });

    if (createResponse.ok) {
      const createdProgram = await createResponse.json();
      console.log('✅ Program created successfully:');
      console.log('  - ID:', createdProgram.id);
      console.log('  - Title:', createdProgram.title);
      console.log('  - Type:', createdProgram.type);
      console.log('  - Slug:', createdProgram.slug);
      console.log('  - Status:', createdProgram.status);
      console.log('  - Created at:', createdProgram.created_at);
    } else {
      const error = await createResponse.json();
      console.log('❌ Error creating program:', error);
    }

    // Test validation error
    console.log('\n📋 Testing validation error...');
    const invalidData = {
      title: '', // Invalid: empty title
      type: 'invalid-type', // Invalid: not in enum
      slug: 'Invalid Slug!', // Invalid: contains spaces and special chars
    };

    const validationResponse = await fetch(`${BASE_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });

    const validationError = await validationResponse.json();
    console.log('✅ Validation error response (expected):', validationError);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();
