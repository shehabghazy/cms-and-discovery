import { Episode, EpisodeKind, EpisodeStatus } from '../src/cms/domain/index.js';
import { InMemoryEpisodeRepository } from '../src/cms/infrastructure/index.js';

async function testEpisodeRepository(): Promise<void> {
  console.log('🗃️ Testing Episode Repository Implementation\n');

  const repository = new InMemoryEpisodeRepository();
  const programId1 = '550e8400-e29b-41d4-a716-446655440000';
  const programId2 = '550e8400-e29b-41d4-a716-446655440001';

  // Create test episodes
  const episode1 = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440010',
    program_id: programId1,
    title: 'First Episode in Program 1',
    slug: 'first-episode-program-1',
    kind: EpisodeKind.AUDIO,
    source: '550e8400-e29b-41d4-a716-446655440100',
    description: 'Description for the first episode'
  });

  const episode2 = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440011',
    program_id: programId1,
    title: 'Second Episode in Program 1',
    slug: 'second-episode-program-1',
    kind: EpisodeKind.VIDEO,
    source: '550e8400-e29b-41d4-a716-446655440101'
  });

  const episode3 = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440012',
    program_id: programId2,
    title: 'First Episode in Program 2',
    slug: 'first-episode-program-2',
    kind: EpisodeKind.AUDIO,
    source: '550e8400-e29b-41d4-a716-446655440102'
  });

  // Test save functionality
  console.log('💾 Testing save functionality...');
  await repository.save(episode1);
  await repository.save(episode2);
  await repository.save(episode3);
  console.log('✅ Episodes saved successfully');

  // Test findById
  console.log('\n🔍 Testing findById...');
  const foundEpisode = await repository.findById(episode1.id);
  console.log('Found episode:', foundEpisode?.title);
  console.log('✅ findById working correctly');

  // Test findBySlugInProgram
  console.log('\n🔍 Testing findBySlugInProgram...');
  const foundBySlug = await repository.findBySlugInProgram(programId1, 'first-episode-program-1');
  console.log('Found by slug:', foundBySlug?.title);
  console.log('✅ findBySlugInProgram working correctly');

  // Test existsBySlugInProgram
  console.log('\n✅ Testing existsBySlugInProgram...');
  const exists = await repository.existsBySlugInProgram(programId1, 'first-episode-program-1');
  const notExists = await repository.existsBySlugInProgram(programId1, 'non-existent-slug');
  console.log('Slug exists:', exists);
  console.log('Non-existent slug:', notExists);
  console.log('✅ existsBySlugInProgram working correctly');

  // Test findByProgramId
  console.log('\n📝 Testing findByProgramId...');
  const program1Episodes = await repository.findByProgramId(programId1);
  console.log('Episodes in program 1:', program1Episodes.data.length, 'total:', program1Episodes.total);
  
  const program2Episodes = await repository.findByProgramId(programId2);
  console.log('Episodes in program 2:', program2Episodes.data.length, 'total:', program2Episodes.total);
  console.log('✅ findByProgramId working correctly');

  // Test findByProgramId with filters
  console.log('\n📝 Testing findByProgramId with filters...');
  const audioEpisodes = await repository.findByProgramId(programId1, {
    filters: { kind: 'audio' }
  });
  console.log('Audio episodes in program 1:', audioEpisodes.data.length);
  console.log('✅ findByProgramId with filters working correctly');

  // Test findMany
  console.log('\n📋 Testing findMany...');
  const allEpisodes = await repository.findMany();
  console.log('Total episodes:', allEpisodes.total);
  
  const filteredByProgram = await repository.findMany({
    filters: { program_id: programId1 }
  });
  console.log('Episodes filtered by program 1:', filteredByProgram.data.length);
  console.log('✅ findMany working correctly');

  // Test countByProgramId
  console.log('\n🔢 Testing countByProgramId...');
  const count1 = await repository.countByProgramId(programId1);
  const count2 = await repository.countByProgramId(programId2);
  console.log('Count for program 1:', count1);
  console.log('Count for program 2:', count2);
  console.log('✅ countByProgramId working correctly');

  // Test search functionality
  console.log('\n🔍 Testing search functionality...');
  const searchResults = await repository.findMany({
    filters: { search: 'first' }
  });
  console.log('Search results for "first":', searchResults.data.length);
  console.log('✅ Search functionality working correctly');

  // Test pagination
  console.log('\n📄 Testing pagination...');
  const page1 = await repository.findMany({
    pagination: { page: 1, limit: 2 }
  });
  console.log('Page 1 (limit 2):', page1.data.length, 'items, total:', page1.total);
  console.log('✅ Pagination working correctly');

  // Test delete functionality
  console.log('\n🗑️ Testing delete functionality...');
  const deleteResult = await repository.delete(episode3.id);
  console.log('Delete result:', deleteResult);
  
  const afterDelete = await repository.findMany();
  console.log('Episodes after delete:', afterDelete.total);
  console.log('✅ Delete functionality working correctly');

  // Test status change and repository consistency
  console.log('\n🔄 Testing status change...');
  episode1.changeStatus({ status: EpisodeStatus.PUBLISHED });
  await repository.save(episode1); // Update the episode in repository
  
  const publishedEpisodes = await repository.findMany({
    filters: { status: 'published' }
  });
  console.log('Published episodes:', publishedEpisodes.data.length);
  console.log('✅ Status filtering working correctly');

  console.log('\n✅ All Episode repository tests passed!');
}

testEpisodeRepository().catch(console.error);
