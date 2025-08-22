import { InMemoryProgramRepository } from '../src/cms/infrastructure/index.js';
import { ListProgramsUseCase, CreateProgramUseCase } from '../src/cms/application/index.js';
import { Program, ProgramType, ProgramStatus } from '../src/cms/domain/index.js';

console.log('🧪 Testing List Programs Feature...\n');

const repo = new InMemoryProgramRepository();
const listUseCase = new ListProgramsUseCase(repo);
const createUseCase = new CreateProgramUseCase(repo);

// Create some test programs using the use case
const programsData = [
  {
    title: 'TypeScript Fundamentals Course',
    type: 'podcast' as const,
    slug: 'typescript-fundamentals-course',
    description: 'Learn TypeScript from scratch',
    language: 'en'
  },
  {
    title: 'JavaScript Weekly Podcast',
    type: 'podcast' as const,
    slug: 'javascript-weekly-podcast',
    description: 'Weekly JavaScript discussions',
    language: 'en'
  },
  {
    title: 'React Learning Series',
    type: 'series' as const,
    slug: 'react-learning-series',
    description: 'Complete React learning path',
    language: 'en'
  }
];

// Save programs using the create use case
console.log('📝 Creating test programs...');
const createdPrograms = [];
for (const programData of programsData) {
  try {
    const result = await createUseCase.execute({ programData });
    createdPrograms.push(result.program);
    console.log(`   - Created: ${result.program.title}`);
  } catch (error) {
    console.log(`   ❌ Failed to create program: ${error}`);
  }
}

// Manually publish one program by getting it and updating status
if (createdPrograms.length > 1) {
  const programToPublish = await repo.findById(createdPrograms[1].id);
  if (programToPublish) {
    programToPublish.changeStatus({ status: ProgramStatus.PUBLISHED });
    await repo.save(programToPublish);
    console.log(`   - Published: ${programToPublish.title}`);
  }
}

console.log('✅ Test 1: List all programs (default pagination)');
try {
  const result1 = await listUseCase.executeForApi({
    pagination: { page: 1, limit: 10 }
  });
  console.log(`   Found ${result1.programs.length} programs`);
  console.log(`   Total: ${result1.pagination.total}`);
  console.log(`   Page: ${result1.pagination.page}/${result1.pagination.totalPages}`);
  console.log(`   Has next: ${result1.pagination.hasNextPage}`);
} catch (error) {
  console.log(`   ❌ Error: ${error}`);
}

console.log('\n✅ Test 2: Filter by type (podcast)');
try {
  const result2 = await listUseCase.executeForApi({
    pagination: { page: 1, limit: 10 },
    filters: { type: 'podcast' }
  });
  console.log(`   Found ${result2.programs.length} podcasts`);
  result2.programs.forEach((p: any) => console.log(`   - ${p.title} (${p.type})`));
} catch (error) {
  console.log(`   ❌ Error: ${error}`);
}

console.log('\n✅ Test 3: Filter by status (published)');
try {
  const result3 = await listUseCase.executeForApi({
    pagination: { page: 1, limit: 10 },
    filters: { status: 'published' }
  });
  console.log(`   Found ${result3.programs.length} published programs`);
  result3.programs.forEach((p: any) => console.log(`   - ${p.title} (${p.status})`));
} catch (error) {
  console.log(`   ❌ Error: ${error}`);
}

console.log('\n✅ Test 4: Search functionality');
try {
  const result4 = await listUseCase.executeForApi({
    pagination: { page: 1, limit: 10 },
    filters: { search: 'typescript' }
  });
  console.log(`   Found ${result4.programs.length} programs matching "typescript"`);
  result4.programs.forEach((p: any) => console.log(`   - ${p.title}`));
} catch (error) {
  console.log(`   ❌ Error: ${error}`);
}

console.log('\n✅ Test 5: Pagination (limit 2)');
try {
  const result5 = await listUseCase.executeForApi({
    pagination: { page: 1, limit: 2 }
  });
  console.log(`   Page 1: ${result5.programs.length} programs`);
  console.log(`   Total pages: ${result5.pagination.totalPages}`);
  console.log(`   Has next page: ${result5.pagination.hasNextPage}`);
  
  if (result5.pagination.hasNextPage) {
    const result6 = await listUseCase.executeForApi({
      pagination: { page: 2, limit: 2 }
    });
    console.log(`   Page 2: ${result6.programs.length} programs`);
  }
} catch (error) {
  console.log(`   ❌ Error: ${error}`);
}

console.log('\n🎉 All list programs tests completed!');
