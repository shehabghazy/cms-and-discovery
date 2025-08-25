// Domain port for search engine abstraction
// Provides a clean interface for search operations without implementation details

import type { IndexName, Doc, IndexDefinition } from './types.js';

/**
 * Search engine interface for handling indexing and search operations
 * This is a port (interface) that defines the contract for search operations
 * Implementations will be provided in the infrastructure layer
 */
export interface SearchEngine {
  /**
   * Initialize the search engine and bootstrap indexes.
   * Must be called after construction to set up the indexes.
   */
  initialize(): Promise<void>;

  /**
   * Idempotent upsert of one document.
   * @param index - The index name
   * @param doc - single document to index
   */
  index(index: IndexName, doc: Doc): Promise<void>;

  /**
   * Delete by document id.
   * @param index - The index name
   * @param ids - single document id to delete
   */
  delete(index: IndexName, id: string[]): Promise<void>;

  /**
   * Search for documents in an index.
   * @param index - The index name
   * @param query - Search query object
   * @returns Array of matching documents
   */
  search<T>(index: IndexName, query: object): Promise<T[]>;

  /**
   * Useful in tests/dev after bulk ops. No-op on stores that don't need it.
   * @param index - Optional index name to refresh (refreshes all if not provided)
   */
  refresh(index?: IndexName): Promise<void>;
}


