import { IEventHandler } from '../../../../shared/application/events/event-handler.js';
import { EventBus } from '../../../../shared/application/events/event-bus.js';
import { ProgramPublishedEvent, ProgramArchivedEvent } from '../../domain/events/index.js';
import { ProgramIndexer } from '../services/program-indexer.js';
import { DomainEvent } from '../../../../shared/domain/events/index.js';

// Strategy interface for handling specific event types
interface StatusHandlingStrategy<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

class ProgramPublishedStrategy implements StatusHandlingStrategy<ProgramPublishedEvent> {
  constructor(private readonly programIndexer: ProgramIndexer) {}

  async handle(event: ProgramPublishedEvent): Promise<void> {
    console.log(`🎯 ProgramStatusEventHandler handling published event for program: ${event.programId} (${event.title})`);
    
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

class ProgramArchivedStrategy implements StatusHandlingStrategy<ProgramArchivedEvent> {
  constructor(private readonly programIndexer: ProgramIndexer) {}

  async handle(event: ProgramArchivedEvent): Promise<void> {
    console.log(`🗂️ ProgramStatusEventHandler handling archived event for program: ${event.programId}`);
    
    await this.programIndexer.remove(event.programId);
    console.log(`🗑️ Program ${event.programId} successfully removed from search engine`);
  }
}

export class ProgramStatusEventHandler implements IEventHandler<ProgramPublishedEvent | ProgramArchivedEvent> {
  private readonly strategies: Map<string, StatusHandlingStrategy<any>> = new Map();

  constructor(
    private readonly programIndexer: ProgramIndexer,
    private readonly eventBus: EventBus
  ) {
    // Initialize strategies
    this.strategies.set('ProgramPublished', new ProgramPublishedStrategy(programIndexer));
    this.strategies.set('ProgramArchived', new ProgramArchivedStrategy(programIndexer));

    // Subscribe to both event types when the handler is created
    this.eventBus.subscribe('ProgramPublished', this);
    this.eventBus.subscribe('ProgramArchived', this);
    console.log('🔔 ProgramStatusEventHandler subscribed to ProgramPublished and ProgramArchived events');
  }

  async handle(event: ProgramPublishedEvent | ProgramArchivedEvent): Promise<void> {
    const strategy = this.strategies.get(event.type);
    
    if (!strategy) {
      console.warn(`⚠️ ProgramStatusEventHandler: No strategy found for event type: ${event.type}`);
      return;
    }

    await strategy.handle(event);
  }
}
