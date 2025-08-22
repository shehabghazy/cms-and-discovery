import { CreateProgramUseCase, type ProgramCreateDto, type ProgramDto } from '../src/cms/application/index.js';
import { type ProgramRepository, Program } from '../src/cms/domain/index.js';

// Simple mock repository for testing
const createMockRepository = (): ProgramRepository => ({
  async save(program: Program): Promise<void> {
    console.log('� Saving program to repository:', program.title);
  },
  async findById(id: string): Promise<Program | null> { return null; },
  async findBySlug(slug: string): Promise<Program | null> { return null; },
  async findMany(): Promise<{ programs: Program[]; total: number }> { 
    return { programs: [], total: 0 }; 
  },
  async delete(id: string): Promise<boolean> { return true; },
  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> { return false; }
});

async function testUpdatedCreateProgram(): Promise<void> {
  console.log('� Testing Updated CreateProgram with Mapper\n');

  const mockRepo = createMockRepository();
  const createUseCase = new CreateProgramUseCase(mockRepo);

  // Test data following the contract schema (no id in create input)
  const programData: ProgramCreateDto = {
    title: 'Advanced TypeScript Course',
    type: 'podcast',
    slug: 'advanced-typescript-course'
  };

  try {
    const result = await createUseCase.execute({ programData });
    
    console.log('✅ Program created successfully!');
    console.log('📋 Program DTO:');
    console.log('  - ID:', result.program.id);
    console.log('  - Title:', result.program.title);
    console.log('  - Type:', result.program.type);
    console.log('  - Slug:', result.program.slug);
    console.log('  - Status:', result.program.status);
    console.log('  - Created at:', result.program.created_at);
    console.log('  - Updated at:', result.program.updated_at);
    
    // Verify the result matches ProgramDto structure
    console.log('\n🔍 Validating DTO structure...');
    console.log('✅ ID is string:', typeof result.program.id === 'string');
    console.log('✅ Created at is ISO string:', typeof result.program.created_at === 'string');
    console.log('✅ Updated at is null or string:', result.program.updated_at === null || typeof result.program.updated_at === 'string');
    
  } catch (error) {
    console.error('❌ Error creating program:', error);
  }
}

testUpdatedCreateProgram().catch(console.error);
