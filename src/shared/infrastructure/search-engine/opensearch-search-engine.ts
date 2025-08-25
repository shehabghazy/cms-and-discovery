// OpenSearch search engine implementation for production use
// Provides integration with OpenSearch cluster for indexing and search operations

import { Client } from '@opensearch-project/opensearch';
import {
  SearchEngine,
  IndexName,
  Doc,
  IndexDefinition
} from '../../domain/ports/search-engine/index.js';

export type OpenSearchConfig = {
  node: string;
  auth?: { username: string; password: string };
  ssl: { rejectUnauthorized: boolean };
  indexPrefix?: string;
};

// --- Index Definitions ---
// These are the mappings structured for OpenSearch.

const programsIndex: IndexDefinition = {
  settings: {
    analysis: {
      analyzer: {
        default: {
          type: 'standard',
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: 'keyword' },
      published_at: { type: 'date' },
      title: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256,
          },
        },
      },
      type: { type: 'keyword' },
      slug: { type: 'keyword' },
      description: { type: 'text' },
      language: { type: 'keyword' },
    },
  },
};

const episodesIndex: IndexDefinition = {
  settings: {
    analysis: {
      analyzer: {
        default: {
          type: 'standard',
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: 'keyword' },
      published_at: { type: 'date' },
      program_id: { type: 'keyword' },
      title: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256,
          },
        },
      },
      slug: { type: 'keyword' },
      description: { type: 'text' },
      kind: { type: 'keyword' },
      source: {
        type: 'keyword',
        index: false,
      },
    },
  },
};

/**
 * OpenSearchSearchEngine provides a concrete implementation of the SearchEngine
 * interface for interacting with an OpenSearch cluster.
 */
export class OpenSearchSearchEngine implements SearchEngine {
  private readonly indexersMapper: Map<IndexName, IndexDefinition>;

  constructor(
    protected readonly config: OpenSearchConfig,
    private readonly client = new Client({
      node: config.node,
      auth: config.auth,
      ssl: { rejectUnauthorized: config.ssl.rejectUnauthorized },
    })
  ) {
    // Map index names to their definitions
    this.indexersMapper = new Map([
      ['programs', programsIndex],
      ['episodes', episodesIndex],
    ]);
  }

  /**
   * Initialize the search engine and bootstrap indexes.
   */
  async initialize(): Promise<void> {
    console.log(`🚀 Starting search engine initialization...`);
    await this.bootstrapIndexes(this.indexersMapper);
    console.log(`🎉 Search engine initialization completed`);
  }

  /**
   * Creates indexes in OpenSearch if they do not already exist.
   * This method is called by the `initialize` method.
   * @param indexersMapper - A map of index names to their definitions.
   */
  private async bootstrapIndexes(indexersMapper: Map<IndexName, IndexDefinition>): Promise<void> {
    console.log(`🌐 Bootstrapping ${indexersMapper.size} indexes for OpenSearch engine at ${this.config.node}`);
    
    for (const [indexName, indexDefinition] of indexersMapper.entries()) {
      try {
        const { body: indexExists } = await this.client.indices.exists({
          index: indexName,
        });

        if (!indexExists) {
          console.log(`🔍 Index "${indexName}" not found. Creating...`);
          
          // Create the index body, omitting aliases if they don't match OpenSearch format
          const indexBody: any = {
            settings: indexDefinition.settings,
            mappings: indexDefinition.mappings,
          };
          
          // Handle aliases if present and convert to OpenSearch format
          if (indexDefinition.aliases && Array.isArray(indexDefinition.aliases)) {
            indexBody.aliases = {};
            indexDefinition.aliases.forEach(alias => {
              indexBody.aliases[alias] = {};
            });
          }
          
          await this.client.indices.create({
            index: indexName,
            body: indexBody,
          });
          console.log(`✅ Index "${indexName}" created successfully.`);
        } else {
          console.log(`✅ Index "${indexName}" already exists.`);
        }
      } catch (error) {
        console.error(`❌ Error bootstrapping index "${indexName}":`, error);
        throw error; // Re-throw to indicate initialization failure
      }
    }
    
    console.log(`🎯 All OpenSearch indexes bootstrapped successfully`);
  }

  /**
   * Indexes (upserts) a single document into the specified index.
   * @param index - The name of the index ('programs' or 'episodes').
   * @param doc - The document to index. It must have an 'id' field.
   */
  async index(index: IndexName, doc: Doc): Promise<void> {
    try {
      await this.client.index({
        index: index,
        id: doc.id,
        body: doc,
        // Refresh the index after this operation to make the document immediately searchable.
        // For high-throughput applications, consider setting to 'wait_for' or 'false'.
        refresh: true, 
      });
    } catch (error) {
      console.error(`❌ Error indexing document with id "${doc.id}" into "${index}":`, error);
      throw error;
    }
  }

  /**
   * Deletes one or more documents from an index using their IDs.
   * @param index - The name of the index.
   * @param ids - An array of document IDs to delete.
   */
  async delete(index: IndexName, ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    try {
      const bulkRequestBody = ids.flatMap(id => [{ delete: { _index: index, _id: id } }]);
      
      const { body: bulkResponse } = await this.client.bulk({
        body: bulkRequestBody,
        refresh: true, // See note in the 'index' method about the refresh parameter
      });

      if (bulkResponse.errors) {
        const erroredDocuments: Array<{ id: string; error: any }> = [];
        bulkResponse.items.forEach((action: any, i: number) => {
          if (action.delete && action.delete.error) {
            erroredDocuments.push({
              id: ids[i],
              error: action.delete.error,
            });
          }
        });
        console.error('❌ Errors encountered during bulk delete:', erroredDocuments);
        throw new Error('Bulk delete operation failed for some documents.');
      }
    } catch (error) {
      console.error(`❌ Error deleting documents from "${index}":`, error);
      throw error;
    }
  }

  /**
   * Search for documents in an index.
   * @param index - The name of the index.
   * @param query - Search query object.
   * @returns Array of matching documents.
   */
  async search<T>(index: IndexName, query: object): Promise<T[]> {
    try {
      const { body } = await this.client.search({
        index: index,
        body: query,
      });

      // Extract the source documents from the search hits
      return body.hits.hits.map((hit: any) => hit._source as T);
    } catch (error) {
      console.error(`❌ Error searching in index "${index}":`, error);
      throw error;
    }
  }

  /**
   * Forces a refresh on one or all indices, making all changes
   * immediately available for search.
   * @param index - Optional. The specific index to refresh. If omitted, all indices are refreshed.
   */
  async refresh(index?: IndexName): Promise<void> {
    try {
      await this.client.indices.refresh({
        // If index is undefined, the client refreshes all indices.
        index: index,
      });
    } catch (error) {
      console.error(`❌ Error refreshing index "${index || 'all'}":`, error);
      throw error;
    }
  }
}
