import { DomainEvent } from '../../../shared/domain/events/index.js';

export class ProgramArchivedEvent extends DomainEvent {
  public readonly programId: string;

  constructor(data: {
    programId: string;
  }) {
    super();
    this.programId = data.programId;
  }

  get type(): string {
    return 'ProgramArchived';
  }

  get details(): Record<string, unknown> {
    return {
      programId: this.programId,
    };
  }
}
