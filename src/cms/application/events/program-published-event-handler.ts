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
    console.log('🔔 ProgramPublishedEventHandler subscribed to ProgramPublished events');
  }

  async handle(event: ProgramPublishedEvent): Promise<void> {
    console.log(`🎯 ProgramPublishedEventHandler handling event for program: ${event.programId} (${event.title})`);
    
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

    console.log(`📊 Indexing program data:`, programData);
    await this.programIndexer.index(programData);
    console.log(`✅ Program ${event.programId} successfully indexed in search engine`);
  }
}
