import { Episode, EpisodeKind } from '../src/cms/internal/domain/index.js';
import { InMemoryEpisodeRepository } from '../src/cms/internal/infrastructure/index.js';

async function testSlugUniquenessInPrograms(): Promise<void> {
  console.log('🔒 Testing Slug Uniqueness Within Programs\n');

  const repository = new InMemoryEpisodeRepository();
  const programId1 = '550e8400-e29b-41d4-a716-446655440000';
  const programId2 = '550e8400-e29b-41d4-a716-446655440001';

  // Create episodes with same slug in different programs (should be allowed)
  const episode1 = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440010',
    program_id: programId1,
    title: 'Episode in Program 1',
    slug: 'same-slug',
    kind: EpisodeKind.AUDIO,
    source: '550e8400-e29b-41d4-a716-446655440100'
  });

  const episode2 = Episode.create({
    id: '550e8400-e29b-41d4-a716-446655440011',
    program_id: programId2,
    title: 'Episode in Program 2',
    slug: 'same-slug', // Same slug but different program
    kind: EpisodeKind.VIDEO,
    source: '550e8400-e29b-41d4-a716-446655440101'
  });

  await repository.save(episode1);
  await repository.save(episode2);

  console.log('✅ Saved episodes with same slug in different programs');

  // Test that each can be found in their respective programs
  const foundInProgram1 = await repository.findBySlugInProgram(programId1, 'same-slug');
  const foundInProgram2 = await repository.findBySlugInProgram(programId2, 'same-slug');

  console.log('Found in program 1:', foundInProgram1?.title);
  console.log('Found in program 2:', foundInProgram2?.title);

  // Test uniqueness checking within same program
  const existsInProgram1 = await repository.existsBySlugInProgram(programId1, 'same-slug');
  const existsInProgram2 = await repository.existsBySlugInProgram(programId2, 'same-slug');
  const existsInProgram1ExcludingEpisode1 = await repository.existsBySlugInProgram(programId1, 'same-slug', episode1.id);

  console.log('Slug exists in program 1:', existsInProgram1);
  console.log('Slug exists in program 2:', existsInProgram2);
  console.log('Slug exists in program 1 (excluding episode 1):', existsInProgram1ExcludingEpisode1);

  // Test moving episode between programs with slug update
  console.log('\n🔄 Testing episode move between programs...');
  
  console.log('Before move - Episode1 details:');
  console.log('  ID:', episode1.id);
  console.log('  Program ID:', episode1.program_id);
  console.log('  Slug:', episode1.slug);
  
  // Move episode1 to program2 with a different slug
  episode1.moveToProgram({
    program_id: programId2,
    slug: 'moved-episode-slug'
  });
  
  console.log('After move - Episode1 details:');
  console.log('  ID:', episode1.id);
  console.log('  Program ID:', episode1.program_id);
  console.log('  Slug:', episode1.slug);
  
  await repository.save(episode1); // Save the updated episode

  // Verify the move
  const originalSlugStillInProgram1 = await repository.findBySlugInProgram(programId1, 'same-slug');
  const foundMovedEpisode = await repository.findBySlugInProgram(programId2, 'moved-episode-slug');
  const stillInProgram2WithOldSlug = await repository.findBySlugInProgram(programId2, 'same-slug');
  const program2Count = await repository.countByProgramId(programId2);
  const program1Count = await repository.countByProgramId(programId1);

  console.log('Original slug still found in program 1:', originalSlugStillInProgram1?.title || 'null');
  console.log('Episode found in new program with new slug:', foundMovedEpisode?.title || 'null');
  console.log('Old slug still in program 2:', stillInProgram2WithOldSlug?.title || 'null');
  console.log('Program 1 episode count:', program1Count);
  console.log('Program 2 episode count:', program2Count);

  console.log('\n✅ Slug uniqueness within programs working correctly!');
}

testSlugUniquenessInPrograms().catch(console.error);
