import { IEventHandler } from '../../../shared/application/events/event-handler.js';
import { EventBus } from '../../../shared/application/events/event-bus.js';
import { ProgramPublishedEvent } from '../../domain/events/index.js';
import { ProgramIndexer } from '../services/program-indexer.js';

export class ProgramPublishedEventHandler implements IEventHandler<ProgramPublishedEvent> {
  constructor(
    private readonly programIndexer: ProgramIndexer,
    private readonly eventBus: EventBus
  ) {
    // Subscribe to the event bus when the handler is created
    this.eventBus.subscribe('ProgramPublished', this);
  }

  async handle(event: ProgramPublishedEvent): Promise<void> {
    // No type checking needed - TypeScript guarantees the correct type!
    const programData = {
      id: event.programId,
      slug: event.slug,
      title: event.title,
      description: event.description,
      type: event.programType,
      language: event.language,
      published_at: event.publishedAt,
    };

    await this.programIndexer.index(programData);
  }
}
