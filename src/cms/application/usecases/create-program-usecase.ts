import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto, ProgramCreateDto } from '../contracts/create-program-contract.js';
import { Program, ProgramType, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { ConflictError } from '../../../shared/application/usecase-errors.js';

export type CreateProgramInput = { programData: ProgramCreateDto };
export type CreateProgramOutput = { program: ProgramDto };

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
      description: input.programData.description || null,
      cover: input.programData.cover || null,
      language: input.programData.language || 'en' // Default to Arabic
    });
    

    await this.repo.save(program);
    
    return { program: toProgramDto(program) };
  }
}
