// Search engine type definitions

export interface SearchEngineConfig {
  [key: string]: any;
}

export type IndexName = string;

export type Doc = { id: string } & Record<string, unknown>;

export interface IndexDefinition {
  mappings?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  aliases?: string[];
}

export interface SearchQuery {
  query?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: Array<Record<string, 'asc' | 'desc'>>;
  from?: number;
  size?: number;
}

export interface SearchResult<T = Doc> {
  hits: T[];
  total: number;
  took?: number;
}

