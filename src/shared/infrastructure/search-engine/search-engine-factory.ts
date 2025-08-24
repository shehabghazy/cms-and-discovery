// Simple factory for creating and initializing search engine instances

import { SearchEngine } from '../../domain/ports/search-engine/search-engine-port.js';
import { InMemorySearchEngine, OpenSearchSearchEngine } from './index.js';

export type SearchEngineType = 'memory' | 'opensearch';

/**
 * Simple factory for creating and initializing search engine instances
 */
export class SearchEngineFactory {
  /**
   * Create a search engine instance of the specified type
   * @param type - The type of search engine to create
   * @returns Initialized search engine instance
   */
  static async create(type: SearchEngineType): Promise<SearchEngine> {
    console.log(`🔍 Initializing search engine: ${type}`);
    let searchEngine: SearchEngine;

    switch (type) {
      case 'memory':
        searchEngine = new InMemorySearchEngine();
        break;
      case 'opensearch':
        searchEngine = new OpenSearchSearchEngine();
        break;
      default:
        throw new Error(`Unsupported search engine type: ${type}`);
    }

    console.log(`⚡ Bootstrapping ${type} search engine indexes...`);
    await searchEngine.initialize();
    console.log(`✅ Search engine ${type} initialized and ready`);
    
    return searchEngine;
  }
}
