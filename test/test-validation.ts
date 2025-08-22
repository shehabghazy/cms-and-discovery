import { Value } from '@sinclair/typebox/value';
import { CreateProgramUseCase, ProgramCreateDto } from '../src/cms/application/index.js';

async function testCreateProgramWithValidation(): Promise<void> {
  console.log('🚀 Testing CreateProgram with TypeBox Validation\n');

  // Mock repository
  const mockRepo = {
    save: async (program: any) => {
      console.log('📝 Saving program to repository:', program.title);
    }
  };

  const createUseCase = new CreateProgramUseCase(mockRepo);

  // Test 1: Valid data
  console.log('📋 Test 1: Valid program data');
  const validData = {
    title: 'Valid Program',
    type: 'podcast',
    slug: 'valid-program',
    status: 'draft'
  };

  const isValid = Value.Check(ProgramCreateDto, validData);
  console.log('✅ Data is valid:', isValid);

  if (isValid) {
    const result = await createUseCase.execute({ programData: validData });
    console.log('✅ Program created:', result.program.title);
  }

  // Test 2: Invalid data (bad slug)
  console.log('\n📋 Test 2: Invalid program data (bad slug)');
  const invalidData = {
    title: 'Invalid Program',
    type: 'podcast',
    slug: 'Invalid Slug!', // Invalid slug with spaces and special chars
    status: 'draft'
  };

  const isInvalid = Value.Check(ProgramCreateDto, invalidData);
  console.log('❌ Data is valid:', isInvalid);

  if (!isInvalid) {
    const errors = [...Value.Errors(ProgramCreateDto, invalidData)];
    console.log('❌ Validation errors:', errors.map(e => `${e.path}: ${e.message}`));
  }

  // Test 3: Invalid data (missing title)
  console.log('\n📋 Test 3: Invalid program data (missing title)');
  const missingTitleData = {
    type: 'podcast',
    slug: 'missing-title',
    status: 'draft'
  };

  const isMissingValid = Value.Check(ProgramCreateDto, missingTitleData);
  console.log('❌ Data is valid:', isMissingValid);

  if (!isMissingValid) {
    const errors = [...Value.Errors(ProgramCreateDto, missingTitleData)];
    console.log('❌ Validation errors:', errors.map(e => `${e.path}: ${e.message}`));
  }
}

testCreateProgramWithValidation().catch(console.error);
