import { 
  CreateProgramUseCase,
  UpdateProgramUseCase,
  ChangeProgramStatusUseCase
} from '../src/cms/application/index.js';
import { ProgramType, ProgramStatus } from '../src/cms/domain/index.js';
import { InMemoryProgramRepository } from '../src/cms/infrastructure/index.js';

async function testProgramUseCases(): Promise<void> {
  console.log('🚀 Testing Program Use Cases\n');

  const programRepository = new InMemoryProgramRepository();

  // Test CreateProgramUseCase
  console.log('📝 Testing CreateProgramUseCase...');
  const createUseCase = new CreateProgramUseCase(programRepository);
  const createResult = await createUseCase.execute({
    programData: {
      title: 'Tech Talk Podcast',
      type: 'podcast',
      slug: 'tech-talk-podcast'
    }
  });
  console.log('Created program:', createResult.program.title);
  
  // Test UpdateProgramUseCase
  console.log('\n✏️ Testing UpdateProgramUseCase...');
  const updateUseCase = new UpdateProgramUseCase(programRepository);
  const updateResult = await updateUseCase.execute({
    programId: createResult.program.id,
    updateData: {
      title: 'Updated Tech Talk Podcast'
    }
  });
  console.log('Updated program:', updateResult.program.title);
  
  // Test ChangeProgramStatusUseCase
  console.log('\n� Testing ChangeProgramStatusUseCase...');
  const changeStatusUseCase = new ChangeProgramStatusUseCase(programRepository);
  const statusResult = await changeStatusUseCase.execute({
    programId: createResult.program.id,
    statusData: {
      status: 'published'
    }
  });
  console.log('Status changed to:', statusResult.program.status);
  console.log('Published at:', statusResult.program.published_at);
  
  console.log('\n✅ All use cases tested successfully!');
}

testProgramUseCases().catch(console.error);
