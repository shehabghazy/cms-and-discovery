import { CreateProgramUseCase, type ProgramCreateDto } from '../src/cms/internal/application/index.js';
import { type ProgramRepository, Program } from '../src/cms/internal/domain/index.js';

// Mock repository implementation for testing
class MockProgramRepository implements ProgramRepository {
  private programs = new Map<string, Program>();

  async save(program: Program): Promise<void> {
    console.log('📝 MockRepository: Saving program:', program.title);
    this.programs.set(program.id, program);
  }

  async findById(id: string): Promise<Program | null> {
    console.log('🔍 MockRepository: Finding program by id:', id);
    return this.programs.get(id) || null;
  }

  async findBySlug(slug: string): Promise<Program | null> {
    console.log('🔍 MockRepository: Finding program by slug:', slug);
    for (const program of this.programs.values()) {
      if (program.slug === slug) return program;
    }
    return null;
  }

  async findMany(options?: {
    pagination?: { page: number; limit: number };
    filters?: { type?: string; status?: string };
  }): Promise<{ data: Program[]; total: number }> {
    console.log('📋 MockRepository: Finding programs with options:', options);
    const programs = Array.from(this.programs.values());
    return { data: programs, total: programs.length };
  }

  async delete(id: string): Promise<boolean> {
    console.log('🗑️ MockRepository: Deleting program:', id);
    return this.programs.delete(id);
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    console.log('🔍 MockRepository: Checking if slug exists:', slug, 'excluding:', excludeId);
    for (const [id, program] of this.programs.entries()) {
      if (program.slug === slug && id !== excludeId) return true;
    }
    return false;
  }
}

async function testWithProgramRepository(): Promise<void> {
  console.log('🚀 Testing CreateProgram with ProgramRepository Interface\n');

  const programRepository = new MockProgramRepository();
  const createUseCase = new CreateProgramUseCase(programRepository);

  // Test data
  const programData: ProgramCreateDto = {
    title: 'TypeScript Mastery Course',
    type: 'podcast',
    slug: 'typescript-mastery-course'
  };

  try {
    // Create the program
    console.log('📝 Creating program...');
    const result = await createUseCase.execute({ programData });
    
    console.log('✅ Program created successfully!');
    console.log('📋 Created Program DTO:');
    console.log('  - ID:', result.program.id);
    console.log('  - Title:', result.program.title);
    console.log('  - Type:', result.program.type);
    console.log('  - Slug:', result.program.slug);
    console.log('  - Status:', result.program.status);
    
    // Test repository operations
    console.log('\n🔍 Testing repository operations...');
    
    // Find by ID
    const foundById = await programRepository.findById(result.program.id);
    console.log('✅ Found by ID:', foundById?.title || 'Not found');
    
    // Find by slug
    const foundBySlug = await programRepository.findBySlug(result.program.slug);
    console.log('✅ Found by slug:', foundBySlug?.title || 'Not found');
    
    // Check slug existence
    const slugExists = await programRepository.existsBySlug(result.program.slug);
    console.log('✅ Slug exists:', slugExists);
    
    // Find many
    const { data: programs, total } = await programRepository.findMany();
    console.log('✅ Total programs in repository:', total);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testWithProgramRepository().catch(console.error);
