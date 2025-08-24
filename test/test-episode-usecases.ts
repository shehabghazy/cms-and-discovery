import { 
  CreateEpisodeUseCase, 
  UpdateEpisodeUseCase, 
  ChangeEpisodeStatusUseCase,
  MoveEpisodeToProgramUseCase,
  ListEpisodesUseCase 
} from '../src/cms/application/usecases/index.js';
import { InMemoryEpisodeRepository, InMemoryProgramRepository } from '../src/cms/infrastructure/index.js';
import { Program, ProgramType, EpisodeKind } from '../src/cms/domain/index.js';
import { InMemoryEventBus } from '../src/shared/infrastructure/events/in-memory-event-bus.js';

async function testEpisodeUseCases(): Promise<void> {
  console.log('🔧 Testing Episode Use Cases\n');

  const episodeRepo = new InMemoryEpisodeRepository();
  const programRepo = new InMemoryProgramRepository();
  
  // Event system
  const eventBus = new InMemoryEventBus();
  
  // Create use case instances
  const createEpisodeUseCase = new CreateEpisodeUseCase(episodeRepo, programRepo);
  const updateEpisodeUseCase = new UpdateEpisodeUseCase(episodeRepo);
  const changeStatusUseCase = new ChangeEpisodeStatusUseCase(episodeRepo, eventBus);
  const moveEpisodeUseCase = new MoveEpisodeToProgramUseCase(episodeRepo, programRepo);
  const listEpisodesUseCase = new ListEpisodesUseCase(episodeRepo);

  // Setup: Create a test program first
  const program = Program.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Podcast Program',
    type: ProgramType.PODCAST,
    slug: 'test-podcast-program'
  });
  await programRepo.save(program);

  const program2 = Program.create({
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Test Video Series',
    type: ProgramType.SERIES,
    slug: 'test-video-series'
  });
  await programRepo.save(program2);

  console.log('✅ Setup: Created test programs');

  // Test 1: Create Episode
  console.log('\n📝 Testing Create Episode Use Case...');
  try {
    const createResult = await createEpisodeUseCase.execute({
      episodeData: {
        program_id: program.id,
        title: 'Introduction to Clean Architecture',
        slug: 'intro-clean-architecture',
        kind: 'audio',
        source: '550e8400-e29b-41d4-a716-446655440100',
        description: 'Learn the basics of clean architecture',
        cover: '550e8400-e29b-41d4-a716-446655440101',
        transcripts: ['550e8400-e29b-41d4-a716-446655440102']
      }
    });
    
    console.log('✅ Episode created successfully');
    console.log('Episode ID:', createResult.episode.id);
    console.log('Episode title:', createResult.episode.title);
    console.log('Episode status:', createResult.episode.status);
    
    const episodeId = createResult.episode.id;

    // Test 2: Update Episode
    console.log('\n✏️ Testing Update Episode Use Case...');
    const updateResult = await updateEpisodeUseCase.execute({
      episodeId: episodeId,
      updateData: {
        title: 'Updated: Introduction to Clean Architecture',
        description: 'Updated description with more comprehensive content',
        transcripts: ['550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440103']
      }
    });
    
    console.log('✅ Episode updated successfully');
    console.log('Updated title:', updateResult.episode.title);
    console.log('Updated description:', updateResult.episode.description);
    console.log('Updated transcripts count:', updateResult.episode.transcripts.length);

    // Test 3: Change Episode Status
    console.log('\n🔄 Testing Change Episode Status Use Case...');
    const statusResult = await changeStatusUseCase.execute({
      episodeId: episodeId,
      statusData: {
        status: 'published'
      }
    });
    
    console.log('✅ Episode status changed successfully');
    console.log('New status:', statusResult.episode.status);
    console.log('Published at:', statusResult.episode.published_at);

    // Test 4: List Episodes
    console.log('\n📋 Testing List Episodes Use Case...');
    
    // Create another episode for more comprehensive testing
    await createEpisodeUseCase.execute({
      episodeData: {
        program_id: program.id,
        title: 'Advanced Design Patterns',
        slug: 'advanced-design-patterns',
        kind: 'video',
        source: '550e8400-e29b-41d4-a716-446655440200'
      }
    });

    const listResult = await listEpisodesUseCase.executeForApi({
      pagination: { page: 1, limit: 10 },
      filters: { program_id: program.id }
    });
    
    console.log('✅ Episodes listed successfully');
    console.log('Total episodes in program:', listResult.pagination.total);
    console.log('Episodes returned:', listResult.episodes.length);
    
    // Test filtering by kind
    const audioEpisodes = await listEpisodesUseCase.executeForApi({
      pagination: { page: 1, limit: 10 },
      filters: { kind: 'audio', program_id: program.id }
    });
    
    console.log('Audio episodes in program:', audioEpisodes.pagination.total);

    // Test 5: Move Episode to Program
    console.log('\n🔄 Testing Move Episode to Program Use Case...');
    const moveResult = await moveEpisodeUseCase.execute({
      episodeId: episodeId,
      moveData: {
        program_id: program2.id,
        slug: 'clean-architecture-basics'
      }
    });
    
    console.log('✅ Episode moved successfully');
    console.log('New program ID:', moveResult.episode.program_id);
    console.log('New slug:', moveResult.episode.slug);

    // Verify the move by listing episodes in both programs
    const program1Episodes = await listEpisodesUseCase.executeForApi({
      pagination: { page: 1, limit: 10 },
      filters: { program_id: program.id }
    });
    const program2Episodes = await listEpisodesUseCase.executeForApi({
      pagination: { page: 1, limit: 10 },
      filters: { program_id: program2.id }
    });
    
    console.log('Episodes remaining in program 1:', program1Episodes.pagination.total);
    console.log('Episodes now in program 2:', program2Episodes.pagination.total);

    // Test 6: Search functionality
    console.log('\n🔍 Testing Search Functionality...');
    const searchResult = await listEpisodesUseCase.executeForApi({
      pagination: { page: 1, limit: 10 },
      filters: { search: 'architecture' }
    });
    
    console.log('Search results for "architecture":', searchResult.pagination.total);

    console.log('\n✅ All Episode use cases tested successfully!');
    
  } catch (error) {
    console.error('❌ Error during Episode use case testing:', error);
    throw error;
  }
}

testEpisodeUseCases().catch(console.error);
