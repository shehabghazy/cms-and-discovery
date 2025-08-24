import { CreateProgramUseCase, type ProgramCreateDto } from '../src/cms/internal/application/index.js';
import { Program } from '../src/cms/internal/domain/index.js';

async function testCreateProgramWithContracts(): Promise<void> {
  console.log('🚀 Testing CreateProgram with Contracts Pattern\n');

  // Mock repository
  const mockRepo = {
    save: async (program: any) => {
      console.log('📝 Saving program to repository:', program.title);
    },
    findById: async (id: string) => null,
    findBySlug: async (slug: string) => null,
      async findMany(): Promise<{ data: Program[]; total: number }> {
    return { data: [], total: 0 };
  },
    delete: async (id: string) => true,
    existsBySlug: async (slug: string) => false
  };

  const createUseCase = new CreateProgramUseCase(mockRepo);

  // Test data following the contract schema
  const programData: ProgramCreateDto = {
    title: 'Advanced TypeScript Course',
    type: 'podcast',
    slug: 'advanced-typescript-course'
  };

  try {
    const result = await createUseCase.execute({ programData });
    
    console.log('✅ Program created successfully!');
    console.log('📋 Program details:');
    console.log('  - ID:', result.program.id);
    console.log('  - Title:', result.program.title);
    console.log('  - Type:', result.program.type);
    console.log('  - Slug:', result.program.slug);
    console.log('  - Status:', result.program.status);
    console.log('  - Created at:', result.program.created_at);
    
  } catch (error) {
    console.error('❌ Error creating program:', error);
  }
}

testCreateProgramWithContracts().catch(console.error);
