// application/use-cases/create-program.ts (use cases depend on TYPES only)
import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto, ProgramCreateDto } from '../contracts/program.contract.js';
import { Program, ProgramType, ProgramStatus, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program.mapper.js';

export type CreateProgramInput = { programData: ProgramCreateDto };
export type CreateProgramOutput = { programData: ProgramDto };

export class CreateProgramUseCase extends CommandUseCase<CreateProgramInput, CreateProgramOutput> {
  constructor(private repo: ProgramRepository) {
    super();
  }
  
  async execute(input: CreateProgramInput): Promise<CreateProgramOutput> {
    // Domain validation happens inside Program.create()
    const program = Program.create({
      id: crypto.randomUUID(), // Generate UUID for new program
      title: input.programData.title,
      type: input.programData.type as ProgramType,
      slug: input.programData.slug,
      status: input.programData.status as ProgramStatus
    });
    
    // Save the program using the repository
    await this.repo.save(program);
    
    return { programData: toProgramDto(program) };
  }
}
