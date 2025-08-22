import { Program, Episode, ProgramType, ProgramStatus, Language } from '../src/cms/domain/index.js';

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
    description: 'In this episode, we discuss the principles of clean architecture and how to implement it in Node.js applications.',
    language: Language.ENGLISH,
    duration_s: 1800,
    source_url: 'https://example.com/episodes/intro-clean-arch.mp3',
    metadata: {
      tags: ['architecture', 'nodejs', 'design-patterns'],
      difficulty: 'intermediate',
      transcript_available: true
    }
  });
  
  console.log('Episode created:', episode.toObject());
  console.log('Formatted duration:', episode.getFormattedDuration());
  
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
  
  episode.setMetadata('views', 1250);
  episode.setMetadata('likes', 89);
  console.log('Episode views:', episode.getMetadata('views'));
  console.log('Updated episode:', episode.toObject());
  
  console.log('\n✅ Domain entities test completed!');
}

testDomainEntities();
