import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';
import type { ProgramUpdateDto } from '../contracts/update-program-contract.js';
import { Program, ProgramType, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type UpdateProgramInput = { 
  programId: string; 
  updateData: ProgramUpdateDto; 
};
export type UpdateProgramOutput = { program: ProgramDto };

export class UpdateProgramUseCase extends CommandUseCase<UpdateProgramInput, UpdateProgramOutput> {
  constructor(private readonly repo: ProgramRepository) {
    super();
  }
  
  async execute(input: UpdateProgramInput): Promise<UpdateProgramOutput> {
    
    // Find the existing program
    const program = await this.repo.findById(input.programId);
    if (!program) {
      throw new NotFoundError(`Program with ID '${input.programId}' not found`);
    }
    
    // Domain validation happens inside program.update()
    program.update({
      title: input.updateData.title,
      type: input.updateData.type as ProgramType | undefined,
      description: input.updateData.description,
      cover: input.updateData.cover,
      language: input.updateData.language
    });
    
    await this.repo.save(program);
    
    return { program: toProgramDto(program) };
  }
}
