import { CreateProgramUseCase, type ProgramCreateDto } from '../src/cms/application/index.js';
import { InMemoryProgramRepository } from '../src/cms/infrastructure/index.js';

async function testNewProgramSchema(): Promise<void> {
  console.log('🚀 Testing New Program Schema Implementation\n');

  const programRepository = new InMemoryProgramRepository();
  const createUseCase = new CreateProgramUseCase(programRepository);

  // Test 1: Create program with all new required fields
  console.log('📋 Test 1: Creating program with new schema');
  const programData: ProgramCreateDto = {
    title: 'Advanced TypeScript Programming Course', // min 10 chars
    type: 'series', // new type
    slug: 'advanced-typescript-programming', // max 80 chars
    description: 'A comprehensive course covering advanced TypeScript concepts and patterns.',
    cover: null, // optional asset_id
    language: 'en' // ISO-639-1
  };

  try {
    const result = await createUseCase.execute({ programData });
    
    console.log('✅ Program created successfully!');
    console.log('📋 Program details:');
    console.log('  - ID:', result.program.id);
    console.log('  - Title:', result.program.title);
    console.log('  - Type:', result.program.type);
    console.log('  - Slug:', result.program.slug);
    console.log('  - Status:', result.program.status); // Should be 'draft'
    console.log('  - Description:', result.program.description);
    console.log('  - Cover:', result.program.cover);
    console.log('  - Language:', result.program.language);
    console.log('  - Published at:', result.program.published_at); // Should be null
    console.log('  - Created at:', result.program.created_at);
    console.log('  - Updated at:', result.program.updated_at);
    
  } catch (error) {
    console.error('❌ Error creating program:', error);
  }

  // Test 2: Test validation - title too short
  console.log('\n📋 Test 2: Testing validation (title too short)');
  try {
    await createUseCase.execute({ 
      programData: {
        title: 'Short', // less than 10 chars
        type: 'podcast',
        slug: 'short-title'
      }
    });
    console.log('❌ Should have failed validation');
  } catch (error: any) {
    console.log('✅ Correctly caught validation error:', error.message);
  }

  // Test 3: Test validation - slug too long
  console.log('\n📋 Test 3: Testing validation (slug too long)');
  try {
    await createUseCase.execute({ 
      programData: {
        title: 'Valid Title Here',
        type: 'podcast',
        slug: 'this-is-a-very-long-slug-that-exceeds-the-maximum-allowed-length-of-eighty-characters-total'
      }
    });
    console.log('❌ Should have failed validation');
  } catch (error: any) {
    console.log('✅ Correctly caught validation error:', error.message);
  }

  console.log('\n🎉 New schema tests completed!');
}

testNewProgramSchema().catch(console.error);
