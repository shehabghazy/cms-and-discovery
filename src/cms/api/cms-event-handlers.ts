import { ProgramIndexer } from '../application/services/program-indexer.js';
import { ProgramPublishedEventHandler } from '../application/events/program-published-event-handler.js';
import { EventBus } from '../../shared/application/events/event-bus.js';
import { SearchEngine } from '../../shared/domain/ports/search-engine/index.js';

export function registerCMSEventHandlers(eventBus: EventBus, searchEngine: SearchEngine): void {
  console.log('🔧 Initializing CMS event system...');

  // Initialize indexing services
  const programIndexer = new ProgramIndexer(searchEngine);

  // Initialize and register event handlers
  const programPublishedHandler = new ProgramPublishedEventHandler(
    programIndexer,
    eventBus
  );

  console.log('✅ CMS event system initialized');
  console.log('   - Search engine: provided as dependency');
  console.log('   - Handlers: ProgramPublishedEventHandler');
}
