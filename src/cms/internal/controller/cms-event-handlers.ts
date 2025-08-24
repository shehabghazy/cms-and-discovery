import { ProgramIndexer } from '../application/services/program-indexer.js';
import { EpisodeIndexer } from '../application/services/episode-indexer.js';
import { ProgramStatusEventHandler } from '../application/events/program-status-event-handler.js';
import { EpisodeStatusEventHandler } from '../application/events/episode-status-event-handler.js';
import { EventBus } from '../../../shared/application/events/event-bus.js';
import { SearchEngine } from '../../../shared/domain/ports/search-engine/index.js';

export function registerCMSEventHandlers(eventBus: EventBus, searchEngine: SearchEngine): void {
  console.log('🔧 Initializing CMS event system...');

  // Initialize indexing services
  const programIndexer = new ProgramIndexer(searchEngine);
  const episodeIndexer = new EpisodeIndexer(searchEngine);

  // Initialize and register event handlers
  const programStatusHandler = new ProgramStatusEventHandler(
    programIndexer,
    eventBus
  );
  
  const episodeStatusHandler = new EpisodeStatusEventHandler(
    episodeIndexer,
    eventBus
  );

  console.log('✅ CMS event system initialized');
  console.log('   - Search engine: provided as dependency');
  console.log('   - Handlers: ProgramStatusEventHandler, EpisodeStatusEventHandler');
}
