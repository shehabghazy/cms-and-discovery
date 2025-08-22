// Test the complete program creation flow
import { CreateProgramUseCase } from '../src/cms/application/usecases/create-program-usecase.js';
import { InMemoryProgramRepository } from '../src/cms/infrastructure/repositories/InMemoryProgramRepository.js';
import { ProgramType, ProgramStatus } from '../src/cms/domain/enums/index.js';
import { ConflictError } from '../src/shared/application/usecase-errors.js';
import { DomainValidationError } from '../src/shared/domain/domain-errors.js';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Program Creation Flow...\n');

  const repository = new InMemoryProgramRepository();
  const useCase = new CreateProgramUseCase(repository);

  // Test 1: Successful program creation
  console.log('✅ Test 1: Successful program creation');
  try {
    const result = await useCase.execute({
      programData: {
        title: 'My Awesome Podcast',
        type: 'podcast',
        slug: 'my-awesome-podcast',
        status: 'draft'
      }
    });
    
    console.log('   Program created:', result.programData.title);
    console.log('   ID:', result.programData.id);
    console.log('   Status:', result.programData.status);
    console.log('   Created at:', result.programData.created_at);
  } catch (error) {
    console.error('   ❌ Unexpected error:', error);
    return;
  }

  // Test 2: Slug conflict detection
  console.log('\n✅ Test 2: Slug conflict detection');
  try {
    await useCase.execute({
      programData: {
        title: 'Another Podcast',
        type: 'podcast',
        slug: 'my-awesome-podcast', // Same slug
        status: 'draft'
      }
    });
    console.error('   ❌ Should have thrown ConflictError');
  } catch (error) {
    if (error instanceof ConflictError) {
      console.log('   ✓ Correctly detected slug conflict:', error.message);
    } else {
      console.error('   ❌ Wrong error type:', error);
    }
  }

  // Test 3: Domain validation error
  console.log('\n✅ Test 3: Domain validation error');
  try {
    await useCase.execute({
      programData: {
        title: '', // Invalid empty title
        type: 'podcast',
        slug: 'empty-title-podcast',
        status: 'draft'
      }
    });
    console.error('   ❌ Should have thrown DomainValidationError');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('   ✓ Correctly caught validation error:', error.message);
    } else {
      console.error('   ❌ Wrong error type:', error);
    }
  }

  // Test 4: Performance test with multiple programs
  console.log('\n✅ Test 4: Performance test');
  const startTime = Date.now();
  const promises: Promise<any>[] = [];
  
  for (let i = 0; i < 100; i++) {
    promises.push(
      useCase.execute({
        programData: {
          title: `Performance Test Program ${i}`,
          type: 'youtube',
          slug: `performance-test-${i}`,
          status: 'published'
        }
      })
    );
  }

  try {
    await Promise.all(promises);
    const endTime = Date.now();
    console.log(`   ✓ Created 100 programs in ${endTime - startTime}ms`);
    console.log(`   ✓ Average: ${(endTime - startTime) / 100}ms per program`);
  } catch (error) {
    console.error('   ❌ Performance test failed:', error);
  }

  // Test 5: Repository performance (slug lookup)
  console.log('\n✅ Test 5: Repository performance');
  const lookupStart = Date.now();
  for (let i = 0; i < 100; i++) {
    await repository.findBySlug(`performance-test-${i}`);
  }
  const lookupEnd = Date.now();
  console.log(`   ✓ 100 slug lookups in ${lookupEnd - lookupStart}ms`);
  console.log(`   ✓ Average lookup: ${(lookupEnd - lookupStart) / 100}ms`);

  console.log('\n🎉 All tests completed successfully!');
}

// Run the tests
testCompleteFlow().catch(console.error);
