// Simple factory for creating and initializing search engine instances

import { SearchEngine } from '../../domain/ports/search-engine/search-engine-port.js';
import { InMemorySearchEngine, type InMemorySearchEngineConfig } from './in-memory-search-engine.js';
import { OpenSearchSearchEngine, type OpenSearchConfig } from './opensearch-search-engine.js';

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
        const memoryConfig: InMemorySearchEngineConfig = { type: 'memory' };
        searchEngine = new InMemorySearchEngine(memoryConfig);
        break;
      case 'opensearch':
        const opensearchConfig: OpenSearchConfig = {
          node: process.env.OPENSEARCH_HOST || 'http://localhost:9200',
          auth: {
            username: process.env.OPENSEARCH_USERNAME || 'admin',
            password: process.env.OPENSEARCH_PASSWORD || 'admin'
          },
          ssl: {
            rejectUnauthorized: process.env.OPENSEARCH_NODE_ENV === 'production'
          }
        };
        searchEngine = new OpenSearchSearchEngine(opensearchConfig);
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
