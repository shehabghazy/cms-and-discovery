// Domain port for search engine abstraction
// Provides a clean interface for search operations without implementation details

import type { IndexName, Doc, IndexDefinition } from './types.js';

export abstract class SearchEngine {
  /**
   * Child classes must define their index mappings as a private attribute
   */
  protected abstract readonly indexersMapper: Map<IndexName, IndexDefinition>;

  /**
   * Initialize the search engine and bootstrap indexes.
   * Must be called after construction to set up the indexes.
   */
  async initialize(): Promise<void> {
    await this.bootstrapIndexes(this.indexersMapper);
  }

  /**
   * Bootstrap multiple indexes with their definitions (idempotent).
   * Called automatically during initialization with the indexersMapper.
   * @param indexersMapper - Map of index names to their definitions
   */
  protected abstract bootstrapIndexes(indexersMapper: Map<IndexName, IndexDefinition>): Promise<void>;

  /**
   * Idempotent upsert of one document.
   * @param index - The index name
   * @param doc - single document to index
   */
  abstract index(index: IndexName, doc: Doc): Promise<void>;

  /**
   * Delete by document id.
   * @param index - The index name
   * @param ids - single document id to delete
   */
  abstract delete(index: IndexName, id: string[]): Promise<void>;

  /**
   * Useful in tests/dev after bulk ops. No-op on stores that don't need it.
   * @param index - Optional index name to refresh (refreshes all if not provided)
   */
  abstract refresh(index?: IndexName): Promise<void>;
}


