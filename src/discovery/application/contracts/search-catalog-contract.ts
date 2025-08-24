import { Type, Static } from '@sinclair/typebox';

// Query parameters schema for search
export const SearchQueryParams = Type.Object({
  q: Type.String({ 
    description: 'Search query text' 
  }),
  type: Type.String({
    enum: ['program', 'episode'],
    description: 'Filter by content type to determine target index'
  }),
  page: Type.Optional(Type.Integer({ 
    minimum: 1, 
    default: 1,
    description: 'Page number for pagination'
  })),
  limit: Type.Optional(Type.Integer({ 
    minimum: 1, 
    maximum: 100, 
    default: 20,
    description: 'Number of results per page'
  }))
});

// Response schema for search results
export const SearchResponse = Type.Object({
  results: Type.Array(Type.Object({
    id: Type.String(),
    title: Type.String(),
    slug: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    type: Type.String(),
    language: Type.Union([Type.String(), Type.Null()]),
    kind: Type.Union([Type.String(), Type.Null()]),
    program_id: Type.Union([Type.String(), Type.Null()]),
    published_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
  })),
  total: Type.Integer(),
  page: Type.Integer(),
  limit: Type.Integer(),
  took: Type.Optional(Type.Integer())
});

// TypeScript interfaces for use case
export interface SearchCatalogInput {
  query?: string;
  filters?: {
    type: 'program' | 'episode';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface SearchCatalogOutput {
  results: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    type: string;
    language: string | null;
    kind: string | null;
    program_id: string | null;
    published_at: Date | null;
  }>;
  total: number;
  page: number;
  limit: number;
  took?: number;
}
