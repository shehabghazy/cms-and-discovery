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
export class InMemorySearchEngine implements SearchEngine {
  private indexes = new Map<IndexName, IndexData>();

  /**
   * Ensure index exists with proper mappings/settings (idempotent).
   */
  async ensureIndex(name: IndexName, def: IndexDefinition = {}): Promise<void> {
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
    await this.ensureIndex(index);
    const indexData = this.indexes.get(index)!;
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
   * Useful in tests/dev after bulk ops. No-op for in-memory implementation.
   */
  async refresh(index?: IndexName): Promise<void> {
    // No-op for in-memory implementation
  }
}
