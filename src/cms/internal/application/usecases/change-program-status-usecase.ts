import { CommandUseCase } from '../../../../shared/index.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';
import type { ProgramChangeStatusDto } from '../contracts/change-program-status-contract.js';
import { Program, ProgramStatus, type ProgramRepository } from '../../domain/index.js';
import { ProgramPublishedEvent, ProgramArchivedEvent } from '../../domain/events/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { NotFoundError } from '../../../../shared/application/usecase-errors.js';
import { EventBus } from '../../../../shared/application/events/event-bus.js';

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
    console.log(`💾 Program ${program.id} saved with new status: ${input.statusData.status}`);
    
    // Publish relevant status change events
    const domainEvents = program.getDomainEvents();
    console.log(`🔍 Found ${domainEvents.length} domain events on program ${program.id}`);
    
    const statusEvents = domainEvents.filter(event => 
      event instanceof ProgramPublishedEvent || event instanceof ProgramArchivedEvent
    );
    
    if (statusEvents.length > 0) {
      console.log(`🚀 Publishing ${statusEvents.length} status change event(s) for program ${program.id}`);
      await this.eventBus.publishAll(statusEvents);
      program.removeEvents(statusEvents);
    } else {
      console.log(`ℹ️  No status change events to publish for program ${program.id}`);
    }
    
    return { program: toProgramDto(program) };
  }
}
