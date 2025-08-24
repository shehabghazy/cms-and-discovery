// Domain port for search engine abstraction
// Provides a clean interface for search operations without implementation details

import type { IndexName, Doc, IndexDefinition } from './types.js';

export interface SearchEngine {
  /**
   * Ensure index exists with proper mappings/settings (idempotent).
   * @param name - The index name
   * @param def - Index definition including mappings, settings, and aliases
   */
  ensureIndex(name: IndexName, def?: IndexDefinition): Promise<void>;


  /**
   * Idempotent upsert of one document.
   * @param index - The index name
   * @param docs - single document to index
   */
  index(index: IndexName, doc: Doc): Promise<void>;


  /**
   * Delete by document id.
   * @param index - The index name
   * @param ids - single document id to delete
   */
  delete(index: IndexName, id: string[]): Promise<void>;


  /**
   * Useful in tests/dev after bulk ops. No-op on stores that don't need it.
   * @param index - Optional index name to refresh (refreshes all if not provided)
   */
  refresh(index?: IndexName): Promise<void>;

}


