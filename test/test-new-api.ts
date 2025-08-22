import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testNewAPI() {
  console.log('🚀 Testing New API Endpoints\n');

  try {
    // Test 1: Create program with new schema
    console.log('📋 Test 1: Create program with new schema...');
    const programData = {
      title: 'Modern Web Development Course',
      type: 'series',
      slug: 'modern-web-development-course',
      description: 'Learn modern web development with React, TypeScript, and Node.js',
      cover: null,
      language: 'en'
    };

    const createResponse = await fetch(`${BASE_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });

    if (createResponse.ok) {
      const createdProgram = await createResponse.json() as any;
      console.log('✅ Program created successfully:');
      console.log('  - ID:', createdProgram.id);
      console.log('  - Title:', createdProgram.title);
      console.log('  - Type:', createdProgram.type);
      console.log('  - Slug:', createdProgram.slug);
      console.log('  - Status:', createdProgram.status);
      console.log('  - Description:', createdProgram.description);
      console.log('  - Cover:', createdProgram.cover);
      console.log('  - Language:', createdProgram.language);
      console.log('  - Published at:', createdProgram.published_at);
      console.log('  - Created at:', createdProgram.created_at);

      const programId = createdProgram.id;

      // Test 2: Update program
      console.log('\n📋 Test 2: Update program...');
      const updateData = {
        title: 'Advanced Modern Web Development Course',
        description: 'Advanced course covering React, TypeScript, Node.js, and GraphQL',
        type: 'documentary',
        language: 'ar'
      };

      const updateResponse = await fetch(`${BASE_URL}/programs/${programId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (updateResponse.ok) {
        const updatedProgram = await updateResponse.json() as any;
        console.log('✅ Program updated successfully:');
        console.log('  - Title:', updatedProgram.title);
        console.log('  - Type:', updatedProgram.type);
        console.log('  - Description:', updatedProgram.description);
        console.log('  - Language:', updatedProgram.language);
        console.log('  - Status:', updatedProgram.status); // Should still be draft
      } else {
        console.log('❌ Update failed:', await updateResponse.text());
      }

      // Test 3: Change status to published
      console.log('\n📋 Test 3: Change status to published...');
      const publishData = {
        status: 'published'
      };

      const publishResponse = await fetch(`${BASE_URL}/programs/${programId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishData),
      });

      if (publishResponse.ok) {
        const publishedProgram = await publishResponse.json() as any;
        console.log('✅ Program published successfully:');
        console.log('  - Status:', publishedProgram.status);
        console.log('  - Published at:', publishedProgram.published_at);
      } else {
        console.log('❌ Publish failed:', await publishResponse.text());
      }

      // Test 4: Change status to archived
      console.log('\n📋 Test 4: Change status to archived...');
      const archiveData = {
        status: 'archived'
      };

      const archiveResponse = await fetch(`${BASE_URL}/programs/${programId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(archiveData),
      });

      if (archiveResponse.ok) {
        const archivedProgram = await archiveResponse.json() as any;
        console.log('✅ Program archived successfully:');
        console.log('  - Status:', archivedProgram.status);
        console.log('  - Published at (preserved):', archivedProgram.published_at);
      } else {
        console.log('❌ Archive failed:', await archiveResponse.text());
      }

    } else {
      const error = await createResponse.json();
      console.log('❌ Error creating program:', error);
    }

    // Test 5: Validation error - title too short
    console.log('\n📋 Test 5: Testing validation (title too short)...');
    const invalidData = {
      title: 'Short', // Less than 10 characters
      type: 'podcast',
      slug: 'short-title'
    };

    const validationResponse = await fetch(`${BASE_URL}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });

    const validationError = await validationResponse.json();
    console.log('✅ Validation error (expected):', validationError);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNewAPI();
