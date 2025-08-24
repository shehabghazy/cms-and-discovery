// In-memory search engine implementation for testing and development
// Provides a simple, fast implementation without external dependencies

import {
  SearchEngine,
  IndexName,
  Doc,
  IndexDefinition,
  IndexNotFoundError
} from '../../domain/ports/search-engine/index.js';

interface IndexData {
  definition: IndexDefinition;
  documents: Map<string, Doc>;
}

/**
 * In-memory implementation of SearchEngine for testing and development.
 * Provides basic indexing functionality without external dependencies.
 */
export class InMemorySearchEngine extends SearchEngine {
  private indexes = new Map<IndexName, IndexData>();
  
  // Define the configuration as required by the abstract class
  protected readonly config = {
    type: 'memory'
  };
  
  // Define the indexes mapper as required by the abstract class
  protected readonly indexersMapper = new Map<IndexName, IndexDefinition>([
    ['programs', { mappings: {}, settings: {} }],
    ['episodes', { mappings: {}, settings: {} }]
  ]);

  /**
   * Bootstrap multiple indexes with their definitions (idempotent).
   */
  protected async bootstrapIndexes(indexersMapper: Map<IndexName, IndexDefinition>): Promise<void> {
    console.log(`📝 Bootstrapping ${indexersMapper.size} indexes for in-memory search engine`);
    for (const [name, definition] of indexersMapper) {
      console.log(`🔧 Creating index: ${name}`);
      await this.ensureIndex(name, definition);
      console.log(`✅ Index created: ${name}`);
    }
    console.log(`🎯 All in-memory indexes bootstrapped successfully`);
  }

  /**
   * Ensure index exists with proper mappings/settings (idempotent).
   */
  private async ensureIndex(name: IndexName, def: IndexDefinition = {}): Promise<void> {
    if (!this.indexes.has(name)) {
      this.indexes.set(name, {
        definition: def,
        documents: new Map()
      });
    }
  }

  /**
   * Idempotent upsert of one document.
   */
  async index(index: IndexName, doc: Doc): Promise<void> {
    const indexData = this.indexes.get(index);
    if (!indexData) {
      throw new IndexNotFoundError(index);
    }
    indexData.documents.set(doc.id, { ...doc });
  }

  /**
   * Delete by document ids.
   */
  async delete(index: IndexName, id: string[]): Promise<void> {
    const indexData = this.indexes.get(index);
    if (!indexData) {
      throw new IndexNotFoundError(index);
    }

    for (const docId of id) {
      indexData.documents.delete(docId);
    }
  }

  /**
   * Search for documents in an index (simplified for in-memory testing).
   * @param index - The name of the index.
   * @param query - Search query object (ignored for simplicity).
   * @returns Array of all documents in the index.
   */
  async search<T>(index: IndexName, query: any): Promise<T[]> {
    const indexData = this.indexes.get(index);
    if (!indexData) {
      throw new IndexNotFoundError(index);
    }

    // For in-memory implementation, just return all documents
    // This is sufficient for testing and development purposes
    const documents = Array.from(indexData.documents.values());
    return documents as T[];
  }

  /**
   * Useful in tests/dev after bulk ops. No-op for in-memory implementation.
   */
  async refresh(index?: IndexName): Promise<void> {
    // No-op for in-memory implementation
  }
}