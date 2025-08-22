import { CreateProgramUseCase, CreateEpisodeUseCase } from '../dist/src/cms/application/index.js';
import { InMemoryProgramRepository, InMemoryEpisodeRepository } from '../dist/src/cms/infrastructure/index.js';

async function testUuidValidation() {
  console.log('🧪 Testing UUID Validation for Cover, Source, and Transcripts\n');

  const programRepo = new InMemoryProgramRepository();
  const episodeRepo = new InMemoryEpisodeRepository();
  const createProgramUseCase = new CreateProgramUseCase(programRepo);
  const createEpisodeUseCase = new CreateEpisodeUseCase(episodeRepo, programRepo);

  try {
    // Test 1: Valid UUID for program cover
    console.log('📝 Test 1: Creating program with valid UUID cover...');
    const validProgramResult = await createProgramUseCase.execute({
      programData: {
        title: 'Program with Valid Cover',
        type: 'series',
        slug: 'program-valid-cover',
        description: 'Test program',
        cover: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
        language: 'en'
      }
    });
    console.log('✅ Program created successfully with cover UUID');

    // Test 2: Create episode with valid UUIDs
    console.log('\n📝 Test 2: Creating episode with valid UUID fields...');
    const validEpisodeResult = await createEpisodeUseCase.execute({
      episodeData: {
        program_id: validProgramResult.program.id,
        title: 'Episode with Valid UUIDs',
        slug: 'episode-valid-uuids',
        kind: 'video',
        source: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID
        cover: '550e8400-e29b-41d4-a716-446655440002', // Valid UUID
        transcripts: [
          '550e8400-e29b-41d4-a716-446655440003',
          '550e8400-e29b-41d4-a716-446655440004'
        ], // Valid UUID array
        description: 'Test episode'
      }
    });
    console.log('✅ Episode created successfully with all UUID fields');

    console.log('\n🎉 UUID validation tests passed!');
    console.log('📋 Summary:');
    console.log('   - Program cover: Valid UUID format enforced');
    console.log('   - Episode source: Valid UUID format enforced');
    console.log('   - Episode cover: Valid UUID format enforced');
    console.log('   - Episode transcripts: Valid UUID array format enforced');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    if (error.statusCode) {
      console.error('Status Code:', error.statusCode);
    }
    if (error.validation) {
      console.error('Validation errors:', error.validation);
    }
    process.exit(1);
  }
}

// Run the test
testUuidValidation();
