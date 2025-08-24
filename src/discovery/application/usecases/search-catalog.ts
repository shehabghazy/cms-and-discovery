import { QueryUseCase } from '../../../shared/application/usecases/query-usecase.js';
import { SearchEngine } from '../../../shared/domain/ports/search-engine/search-engine-port.js';
import { SearchResult, SearchQuery } from '../../../shared/domain/ports/search-engine/types.js';
import { SearchCatalogInput, SearchCatalogOutput } from '../contracts/search-catalog-contract.js';

export class SearchCatalogUseCase extends QueryUseCase<SearchCatalogInput, SearchCatalogOutput> {
  constructor(private readonly searchEngine: SearchEngine) {
    super();
  }

  async execute(input: SearchCatalogInput): Promise<SearchCatalogOutput> {
    const { type } = input.filters!;
    const index = type === 'program' ? 'programs' : 'episodes';
    const pagination = input.pagination || { page: 1, limit: 20 };
    
    const searchQuery: SearchQuery = {
      query: input.query ? {
        multi_match: {
          query: input.query,
          fields: ['title^2', 'description']
        }
      } : { match_all: {} },
      from: (pagination.page - 1) * pagination.limit,
      size: pagination.limit,
    };

    const documents = await this.searchEngine.search(index, searchQuery);

    return {
      results: documents.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        description: doc.description || null,
        type: doc.type || type,
        language: doc.language || null,
        kind: doc.kind || null,
        program_id: doc.program_id || null,
        published_at: doc.published_at ? new Date(doc.published_at) : null,
      })),
      total: documents.length, // This is a limitation, we don't get total count
      page: pagination.page,
      limit: pagination.limit,
      took: undefined, // This is a limitation, we don't get took time
    };
  }
}
