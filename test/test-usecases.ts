import { 
  CreateProgramUseCase,
  UpdateProgramUseCase,
  DeleteProgramUseCase,
  ListProgramsUseCase
} from '../src/cms/application/index.js';
import { ProgramType, ProgramStatus } from '../src/cms/domain/index.js';

async function testProgramUseCases(): Promise<void> {
  console.log('🚀 Testing Program Use Cases\n');

  // Test CreateProgramUseCase
  console.log('📝 Testing CreateProgramUseCase...');
  const createUseCase = new CreateProgramUseCase();
  const createResult = await createUseCase.execute({
    programData: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Tech Talk Podcast',
      type: ProgramType.PODCAST,
      slug: 'tech-talk-podcast',
      status: ProgramStatus.DRAFT
    }
  });
  console.log('Created program:', createResult.program.title);
  
  // Test UpdateProgramUseCase
  console.log('\n✏️ Testing UpdateProgramUseCase...');
  const updateUseCase = new UpdateProgramUseCase();
  const updateResult = await updateUseCase.execute({
    programId: '550e8400-e29b-41d4-a716-446655440000',
    updateData: {
      title: 'Updated Tech Talk Podcast',
      status: ProgramStatus.PUBLISHED
    }
  });
  console.log('Updated program:', updateResult.program.title);
  console.log('New status:', updateResult.program.status);
  
  // Test DeleteProgramUseCase
  console.log('\n🗑️ Testing DeleteProgramUseCase...');
  const deleteUseCase = new DeleteProgramUseCase();
  const deleteResult = await deleteUseCase.execute({
    programId: '550e8400-e29b-41d4-a716-446655440000'
  });
  console.log('Delete success:', deleteResult.success);
  
  // Test ListProgramsUseCase
  console.log('\n📋 Testing ListProgramsUseCase...');
  const listUseCase = new ListProgramsUseCase();
  const listResult = await listUseCase.execute({
    page: 1,
    limit: 10,
    type: 'podcast'
  });
  console.log('Programs found:', listResult.programs.length);
  console.log('Total programs:', listResult.total);
  console.log('Page:', listResult.page);
  
  console.log('\n✅ All use cases tested successfully!');
}

testProgramUseCases().catch(console.error);
