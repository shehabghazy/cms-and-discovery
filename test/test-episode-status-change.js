import { 
  CreateEpisodeUseCase, 
  ChangeEpisodeStatusUseCase,
  CreateProgramUseCase 
} from '../dist/src/cms/application/index.js';
import { InMemoryEpisodeRepository, InMemoryProgramRepository } from '../dist/src/cms/infrastructure/index.js';

async function testEpisodeStatusChange() {
  console.log('🧪 Testing Episode Status Change (without published_at in input)\n');

  // Setup repositories and use cases
  const programRepo = new InMemoryProgramRepository();
  const episodeRepo = new InMemoryEpisodeRepository();
  const createProgramUseCase = new CreateProgramUseCase(programRepo);
  const createEpisodeUseCase = new CreateEpisodeUseCase(episodeRepo, programRepo); // Needs both repos
  const changeStatusUseCase = new ChangeEpisodeStatusUseCase(episodeRepo);

  try {
    // Create a test program
    const program = await createProgramUseCase.execute({
      programData: {
        title: 'Test Program',
        type: 'series',
        slug: 'test-program',
        description: 'A test program',
        language: 'en'
      }
    });

    console.log('✅ Created program:', program.program.title);

    // Create an episode
    const episode = await createEpisodeUseCase.execute({
      episodeData: {
        program_id: program.program.id,
        title: 'Test Episode',
        slug: 'test-episode',
        kind: 'video',
        source: '550e8400-e29b-41d4-a716-446655440000', // Mock UUID
        description: 'A test episode'
      }
    });

    console.log('✅ Created episode:', episode.episode.title);
    console.log('   Initial status:', episode.episode.status);
    console.log('   Initial published_at:', episode.episode.published_at);

    // Change status to published (without providing published_at)
    const publishedEpisode = await changeStatusUseCase.execute({
      episodeId: episode.episode.id,
      statusData: {
        status: 'published'
        // Note: No published_at provided - should be set automatically
      }
    });

    console.log('\n🔄 Changed status to published:');
    console.log('   New status:', publishedEpisode.episode.status);
    console.log('   Published at (auto-set):', publishedEpisode.episode.published_at);
    console.log('   ✅ published_at was automatically set!');

    // Try to change to hidden
    const hiddenEpisode = await changeStatusUseCase.execute({
      episodeId: episode.episode.id,
      statusData: {
        status: 'hidden'
      }
    });

    console.log('\n🔄 Changed status to hidden:');
    console.log('   New status:', hiddenEpisode.episode.status);
    console.log('   Published at (preserved):', hiddenEpisode.episode.published_at);
    console.log('   ✅ published_at was preserved when hiding!');

    console.log('\n🎉 Episode status change test passed!');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testEpisodeStatusChange();
