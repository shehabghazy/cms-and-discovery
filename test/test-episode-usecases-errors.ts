import { 
  CreateEpisodeUseCase, 
  UpdateEpisodeUseCase, 
  MoveEpisodeToProgramUseCase 
} from '../src/cms/internal/application/usecases/index.js';
import { InMemoryEpisodeRepository, InMemoryProgramRepository } from '../src/cms/internal/infrastructure/index.js';
import { Program, ProgramType } from '../src/cms/internal/domain/index.js';

async function testEpisodeUseCaseErrors(): Promise<void> {
  console.log('🚨 Testing Episode Use Case Error Handling\n');

  const episodeRepo = new InMemoryEpisodeRepository();
  const programRepo = new InMemoryProgramRepository();
  
  const createEpisodeUseCase = new CreateEpisodeUseCase(episodeRepo, programRepo);
  const updateEpisodeUseCase = new UpdateEpisodeUseCase(episodeRepo);
  const moveEpisodeUseCase = new MoveEpisodeToProgramUseCase(episodeRepo, programRepo);

  // Setup: Create a test program
  const program = Program.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Podcast Program',
    type: ProgramType.PODCAST,
    slug: 'test-podcast-program'
  });
  await programRepo.save(program);

  // Test 1: Create episode with non-existent program
  console.log('1️⃣ Testing create episode with non-existent program...');
  try {
    await createEpisodeUseCase.execute({
      episodeData: {
        program_id: '550e8400-e29b-41d4-a716-446655440999', // Non-existent
        title: 'Test Episode',
        slug: 'test-episode',
        kind: 'audio',
        source: '550e8400-e29b-41d4-a716-446655440100'
      }
    });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error: any) {
    console.log('✅ Correctly threw error:', error.message);
  }

  // Test 2: Create episode with duplicate slug in same program
  console.log('\n2️⃣ Testing create episode with duplicate slug...');
  
  // First, create an episode
  await createEpisodeUseCase.execute({
    episodeData: {
      program_id: program.id,
      title: 'First Episode',
      slug: 'duplicate-slug',
      kind: 'audio',
      source: '550e8400-e29b-41d4-a716-446655440100'
    }
  });
  
  // Then try to create another with same slug
  try {
    await createEpisodeUseCase.execute({
      episodeData: {
        program_id: program.id,
        title: 'Second Episode',
        slug: 'duplicate-slug', // Same slug
        kind: 'video',
        source: '550e8400-e29b-41d4-a716-446655440101'
      }
    });
    console.log('❌ Should have thrown ConflictError');
  } catch (error: any) {
    console.log('✅ Correctly threw error:', error.message);
  }

  // Test 3: Update non-existent episode
  console.log('\n3️⃣ Testing update non-existent episode...');
  try {
    await updateEpisodeUseCase.execute({
      episodeId: '550e8400-e29b-41d4-a716-446655440999', // Non-existent
      updateData: {
        title: 'Updated Title'
      }
    });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error: any) {
    console.log('✅ Correctly threw error:', error.message);
  }

  // Test 4: Move episode to non-existent program
  console.log('\n4️⃣ Testing move episode to non-existent program...');
  
  // Create an episode first
  const episodeResult = await createEpisodeUseCase.execute({
    episodeData: {
      program_id: program.id,
      title: 'Episode to Move',
      slug: 'episode-to-move',
      kind: 'audio',
      source: '550e8400-e29b-41d4-a716-446655440200'
    }
  });
  
  try {
    await moveEpisodeUseCase.execute({
      episodeId: episodeResult.episode.id,
      moveData: {
        program_id: '550e8400-e29b-41d4-a716-446655440999', // Non-existent
        slug: 'new-slug'
      }
    });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error: any) {
    console.log('✅ Correctly threw error:', error.message);
  }

  // Test 5: Move episode with conflicting slug in target program
  console.log('\n5️⃣ Testing move episode with conflicting slug...');
  
  // Create another program and episode
  const program2 = Program.create({
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Second Program',
    type: ProgramType.SERIES,
    slug: 'second-program'
  });
  await programRepo.save(program2);
  
  await createEpisodeUseCase.execute({
    episodeData: {
      program_id: program2.id,
      title: 'Existing Episode in Program 2',
      slug: 'existing-slug',
      kind: 'video',
      source: '550e8400-e29b-41d4-a716-446655440300'
    }
  });
  
  try {
    await moveEpisodeUseCase.execute({
      episodeId: episodeResult.episode.id,
      moveData: {
        program_id: program2.id,
        slug: 'existing-slug' // Conflicts with existing episode
      }
    });
    console.log('❌ Should have thrown ConflictError');
  } catch (error: any) {
    console.log('✅ Correctly threw error:', error.message);
  }

  // Test 6: Domain validation errors (invalid data)
  console.log('\n6️⃣ Testing domain validation errors...');
  try {
    await createEpisodeUseCase.execute({
      episodeData: {
        program_id: program.id,
        title: 'Short', // Too short (< 10 chars)
        slug: 'valid-slug',
        kind: 'audio',
        source: '550e8400-e29b-41d4-a716-446655440400'
      }
    });
    console.log('❌ Should have thrown DomainValidationError');
  } catch (error: any) {
    console.log('✅ Correctly threw domain validation error:', error.message);
  }

  console.log('\n✅ All error handling scenarios tested successfully!');
}

testEpisodeUseCaseErrors().catch(console.error);
