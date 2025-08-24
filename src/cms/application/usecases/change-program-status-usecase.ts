import { CommandUseCase } from '../../../shared/index.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';
import type { ProgramChangeStatusDto } from '../contracts/change-program-status-contract.js';
import { Program, ProgramStatus, type ProgramRepository } from '../../domain/index.js';
import { ProgramPublishedEvent } from '../../domain/events/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';
import { EventBus } from '../../../shared/application/events/event-bus.js';

export type ChangeProgramStatusInput = { 
  programId: string; 
  statusData: ProgramChangeStatusDto; 
};
export type ChangeProgramStatusOutput = { program: ProgramDto };

export class ChangeProgramStatusUseCase extends CommandUseCase<ChangeProgramStatusInput, ChangeProgramStatusOutput> {
  constructor(
    private readonly repo: ProgramRepository,
    private readonly eventBus: EventBus
  ) {
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
    
    // Save the program first
    await this.repo.save(program);
    
    // Publish only ProgramPublishedEvent events
    const domainEvents = program.getDomainEvents();
    const programPublishedEvents = domainEvents.filter(event => event instanceof ProgramPublishedEvent);
    
    if (programPublishedEvents.length > 0) {
      await this.eventBus.publishAll(programPublishedEvents);
      // Remove only the published events from the program
      program.removeEvents(programPublishedEvents);
    }
    
    return { program: toProgramDto(program) };
  }
}
