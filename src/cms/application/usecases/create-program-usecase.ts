// application/use-cases/create-program.ts (use cases depend on TYPES only)
import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto, ProgramCreateDto } from '../contracts/create-program-contract.js';
import { Program, ProgramType, ProgramStatus, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { ConflictError } from '../../../shared/application/usecase-errors.js';

export type CreateProgramInput = { programData: ProgramCreateDto };
export type CreateProgramOutput = { programData: ProgramDto };

export class CreateProgramUseCase extends CommandUseCase<CreateProgramInput, CreateProgramOutput> {
  constructor(private readonly repo: ProgramRepository) {
    super();
  }
  
  async execute(input: CreateProgramInput): Promise<CreateProgramOutput> {
    
    // Check for slug conflicts first (async business rule)
    const existingProgram = await this.repo.findBySlug(input.programData.slug);
    if (existingProgram) {
      throw new ConflictError(`Program with slug '${input.programData.slug}' already exists`);
    }
    
    // Domain validation happens inside Program.create()
    const program = Program.create({
      id: crypto.randomUUID(), // Generate UUID for new program
      title: input.programData.title,
      type: input.programData.type as ProgramType,
      slug: input.programData.slug,
      status: (input.programData.status as ProgramStatus) ?? ProgramStatus.DRAFT
    });
    

    await this.repo.save(program);
    
    return { programData: toProgramDto(program) };
  }
}
