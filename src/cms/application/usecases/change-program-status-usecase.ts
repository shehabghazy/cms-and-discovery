import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';
import type { ProgramChangeStatusDto } from '../contracts/change-program-status-contract.js';
import { Program, ProgramStatus, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type ChangeProgramStatusInput = { 
  programId: string; 
  statusData: ProgramChangeStatusDto; 
};
export type ChangeProgramStatusOutput = { program: ProgramDto };

export class ChangeProgramStatusUseCase extends CommandUseCase<ChangeProgramStatusInput, ChangeProgramStatusOutput> {
  constructor(private readonly repo: ProgramRepository) {
    super();
  }
  
  async execute(input: ChangeProgramStatusInput): Promise<ChangeProgramStatusOutput> {
    
    // Find the existing program
    const program = await this.repo.findById(input.programId);
    if (!program) {
      throw new NotFoundError(`Program with ID '${input.programId}' not found`);
    }
    
    // Domain validation happens inside program.changeStatus()
    program.changeStatus({
      status: input.statusData.status as ProgramStatus.PUBLISHED | ProgramStatus.ARCHIVED
    });
    
    await this.repo.save(program);
    
    return { program: toProgramDto(program) };
  }
}
