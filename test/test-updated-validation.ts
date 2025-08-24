import { Value } from '@sinclair/typebox/value';
import { 
  CreateProgramUseCase, 
  ProgramCreateDto, 
  ProgramDto 
} from '../src/cms/internal/application/index.js';
import { type ProgramRepository, Program } from '../src/cms/internal/domain/index.js';

// Simple mock repository for testing
const createMockRepository = (): ProgramRepository => ({
  async save(program: Program): Promise<void> {
    console.log('� Saving program to repository:', program.title);
  },
  async findById(id: string): Promise<Program | null> { return null; },
  async findBySlug(slug: string): Promise<Program | null> { return null; },
  async findMany(): Promise<{ data: Program[]; total: number }> {
    return { data: [], total: 0 };
  },
  async delete(id: string): Promise<boolean> { return true; },
  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> { return false; }
});

async function testUpdatedValidation(): Promise<void> {
  console.log('🚀 Testing Updated Validation with DTOs\n');

  const mockRepo = createMockRepository();
  const createUseCase = new CreateProgramUseCase(mockRepo);

  // Test 1: Valid input data (no id required in create)
  console.log('📋 Test 1: Valid input data');
  const validInputData = {
    title: 'Valid Program',
    type: 'podcast',
    slug: 'valid-program',
    status: 'draft'
  };

  const isValidInput = Value.Check(ProgramCreateDto, validInputData);
  console.log('✅ Input data is valid:', isValidInput);

  if (isValidInput) {
    const result = await createUseCase.execute({ programData: validInputData });
    
    // Test that the output matches ProgramDto schema
    const isValidOutput = Value.Check(ProgramDto, result.program);
    console.log('✅ Output DTO is valid:', isValidOutput);
    
    if (!isValidOutput) {
      const errors = [...Value.Errors(ProgramDto, result.program)];
      console.log('❌ Output validation errors:', errors.map(e => `${e.path}: ${e.message}`));
    } else {
      console.log('✅ Program DTO created successfully:', result.program.title);
    }
  }

  // Test 2: Input with id field (should fail if id is not allowed in create)
  console.log('\n📋 Test 2: Input with id field (should be rejected)');
  const inputWithId = {
    id: 'some-id', // This should not be allowed in create input
    title: 'Program with ID',
    type: 'podcast',
    slug: 'program-with-id',
    status: 'draft'
  };

  const hasExtraField = Value.Check(ProgramCreateDto, inputWithId);
  console.log('❌ Input with extra id field is valid:', hasExtraField);

  if (!hasExtraField) {
    const errors = [...Value.Errors(ProgramCreateDto, inputWithId)];
    console.log('✅ Correctly rejected extra field. Errors:', errors.map(e => `${e.path}: ${e.message}`));
  }

  // Test 3: Invalid enum value
  console.log('\n📋 Test 3: Invalid enum value');
  const invalidEnumData = {
    title: 'Invalid Enum Program',
    type: 'invalid-type', // Invalid type
    slug: 'invalid-enum-program',
    status: 'draft'
  };

  const isInvalidEnum = Value.Check(ProgramCreateDto, invalidEnumData);
  console.log('❌ Data with invalid enum is valid:', isInvalidEnum);

  if (!isInvalidEnum) {
    const errors = [...Value.Errors(ProgramCreateDto, invalidEnumData)];
    console.log('✅ Correctly rejected invalid enum. Errors:', errors.map(e => `${e.path}: ${e.message}`));
  }
}

testUpdatedValidation().catch(console.error);
