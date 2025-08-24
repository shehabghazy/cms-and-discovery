import { IEventHandler } from '../../../shared/application/events/event-handler.js';
import { EventBus } from '../../../shared/application/events/event-bus.js';
import { EpisodePublishedEvent, EpisodeHiddenEvent } from '../../domain/events/index.js';
import { EpisodeIndexer } from '../services/episode-indexer.js';
import { DomainEvent } from '../../../shared/domain/events/index.js';

// Strategy interface for handling specific event types
interface StatusHandlingStrategy<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

class EpisodePublishedStrategy implements StatusHandlingStrategy<EpisodePublishedEvent> {
  constructor(private readonly episodeIndexer: EpisodeIndexer) {}

  async handle(event: EpisodePublishedEvent): Promise<void> {
    console.log(`🎯 EpisodeStatusEventHandler handling published event for episode: ${event.episodeId} (${event.title})`);
    
    const episodeData = {
      id: event.episodeId,
      program_id: event.programId,
      slug: event.slug,
      title: event.title,
      description: event.description,
      kind: event.kind,
      published_at: event.publishedAt,
    };

    console.log(`📊 Indexing episode data:`, episodeData);
    await this.episodeIndexer.index(episodeData);
    console.log(`✅ Episode ${event.episodeId} successfully indexed in search engine`);
  }
}

class EpisodeHiddenStrategy implements StatusHandlingStrategy<EpisodeHiddenEvent> {
  constructor(private readonly episodeIndexer: EpisodeIndexer) {}

  async handle(event: EpisodeHiddenEvent): Promise<void> {
    console.log(`🗂️ EpisodeStatusEventHandler handling hidden event for episode: ${event.episodeId}`);
    
    await this.episodeIndexer.remove(event.episodeId);
    console.log(`🗑️ Episode ${event.episodeId} successfully removed from search engine`);
  }
}

export class EpisodeStatusEventHandler implements IEventHandler<EpisodePublishedEvent | EpisodeHiddenEvent> {
  private readonly strategies: Map<string, StatusHandlingStrategy<any>> = new Map();

  constructor(
    private readonly episodeIndexer: EpisodeIndexer,
    private readonly eventBus: EventBus
  ) {
    // Initialize strategies
    this.strategies.set('EpisodePublished', new EpisodePublishedStrategy(episodeIndexer));
    this.strategies.set('EpisodeHidden', new EpisodeHiddenStrategy(episodeIndexer));

    // Subscribe to both event types when the handler is created
    this.eventBus.subscribe('EpisodePublished', this);
    this.eventBus.subscribe('EpisodeHidden', this);
    console.log('🔔 EpisodeStatusEventHandler subscribed to EpisodePublished and EpisodeHidden events');
  }

  async handle(event: EpisodePublishedEvent | EpisodeHiddenEvent): Promise<void> {
    const strategy = this.strategies.get(event.type);
    
    if (!strategy) {
      console.warn(`⚠️ EpisodeStatusEventHandler: No strategy found for event type: ${event.type}`);
      return;
    }

    await strategy.handle(event);
  }
}
