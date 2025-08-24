/**
 * Simplified value object for discovery search queries
 * Focused only on search engine functionality
 */
export interface DiscoverySearchQuery {
  readonly query?: string;
  readonly filters?: DiscoveryFilters;
  readonly pagination?: DiscoveryPagination;
  readonly sort?: DiscoverySort;
}

export interface DiscoveryFilters {
  readonly type?: 'program' | 'episode';
  readonly programId?: string;
  readonly status?: 'published';
  readonly language?: string;
  readonly kind?: 'audio' | 'video'; // for episodes
}

export interface DiscoveryPagination {
  readonly page: number;
  readonly limit: number;
}

export interface DiscoverySort {
  readonly field: 'title' | 'published_at' | 'created_at';
  readonly direction: 'asc' | 'desc';
}

/**
 * Simple factory for creating search queries
 */
export class DiscoverySearchQueryBuilder {
  private query?: string;
  private filters: DiscoveryFilters = {};
  private pagination: DiscoveryPagination = { page: 1, limit: 20 };
  private sort: DiscoverySort = { field: 'published_at', direction: 'desc' };

  static create(): DiscoverySearchQueryBuilder {
    return new DiscoverySearchQueryBuilder();
  }

  withQuery(query: string): this {
    this.query = query;
    return this;
  }

  withType(type: 'program' | 'episode'): this {
    this.filters = { ...this.filters, type };
    return this;
  }

  withProgramId(programId: string): this {
    this.filters = { ...this.filters, programId };
    return this;
  }

  withPagination(page: number, limit: number): this {
    this.pagination = { page, limit };
    return this;
  }

  withSort(field: DiscoverySort['field'], direction: DiscoverySort['direction']): this {
    this.sort = { field, direction };
    return this;
  }

  build(): DiscoverySearchQuery {
    return {
      query: this.query,
      filters: { ...this.filters, status: 'published' }, // Always filter for published
      pagination: this.pagination,
      sort: this.sort,
    };
  }
}
