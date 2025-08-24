import { Program, Episode, ProgramType, ProgramStatus, EpisodeKind, EpisodeStatus } from '../src/cms/internal/domain/index.js';

function testDomainEntities(): void {
  console.log('🚀 Testing CMS Domain Entities\n');

  console.log('📺 Creating a Program...');
  const program: Program = Program.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Tech Talk Podcast',
    type: ProgramType.PODCAST,
    slug: 'tech-talk-podcast'
  });
  
  console.log('Program created:', program.toObject());
  
  console.log('\n🎬 Creating an Episode...');
  const episode: Episode = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440001',
    program_id: program.id,
    title: 'Introduction to Clean Architecture',
    slug: 'intro-clean-architecture',
    kind: EpisodeKind.AUDIO,
    source: '550e8400-e29b-41d4-a716-446655440002', // asset_id
    description: 'In this episode, we discuss the principles of clean architecture and how to implement it in Node.js applications.',
    cover: '550e8400-e29b-41d4-a716-446655440003', // asset_id
    transcripts: ['550e8400-e29b-41d4-a716-446655440004'] // asset_id array
  });
  
  console.log('Episode created:', episode.toObject());
  
  // Test simplified update methods
  console.log('\n🔄 Testing simplified update methods...');
  
  // Test Program update method
  program.update({
    title: 'Updated Tech Talk Podcast'
  });
  
  // Test status change method
  program.changeStatus({
    status: ProgramStatus.PUBLISHED
  });
  console.log('Program after update:', {
    title: program.title,
    status: program.status,
    updated_at: program.updated_at
  });
  
  // Test Episode update method
  episode.update({
    title: 'Updated Introduction to Clean Architecture',
    description: 'Updated description with more details about clean architecture patterns.'
  });
  console.log('Episode after update:', {
    title: episode.title,
    description: episode.description,
    updated_at: episode.updated_at
  });
  
  // Test Episode status change
  episode.changeStatus({
    status: EpisodeStatus.PUBLISHED
  });
  console.log('Episode after status change:', {
    status: episode.status,
    published_at: episode.published_at
  });
  
  // Test Episode move to program
  const newProgramId = '550e8400-e29b-41d4-a716-446655440005';
  episode.moveToProgram({
    program_id: newProgramId,
    slug: 'clean-architecture-intro'
  });
  console.log('Episode after move:', {
    program_id: episode.program_id,
    slug: episode.slug
  });
  
  console.log('\n✅ Domain entities test completed!');
}

testDomainEntities();
