import { Type, Static } from '@sinclair/typebox';
import { EpisodeKind, EpisodeStatus } from './shared-types.js';
import { EpisodeDto } from './create-episode-contract.js';
import { PaginationMetaSchema } from '../../../shared/index.js';

// Query parameters for listing episodes with pagination
export const ListEpisodesQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  status: Type.Optional(EpisodeStatus),
  kind: Type.Optional(EpisodeKind),
  program_id: Type.Optional(Type.String({ format: 'uuid' })),
  search: Type.Optional(Type.String({ minLength: 1, maxLength: 100 }))
});

// Response schema for list episodes
export const ListEpisodesResponse = Type.Object({
  episodes: Type.Array(EpisodeDto),
  pagination: PaginationMetaSchema
});

// List episodes filters schema (for internal use)
export const ListEpisodesFiltersDto = Type.Object({
  status: Type.Optional(EpisodeStatus),
  kind: Type.Optional(EpisodeKind),
  program_id: Type.Optional(Type.String({ format: 'uuid' })),
  search: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
}, { additionalProperties: false });

export type ListEpisodesFiltersDto = Static<typeof ListEpisodesFiltersDto>;

// Pagination schema (for internal use)
export const PaginationDto = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
}, { additionalProperties: false });

export type PaginationDto = Static<typeof PaginationDto>;

// List episodes input schema (for internal use)
export const ListEpisodesInputDto = Type.Object({
  pagination: Type.Optional(PaginationDto),
  filters: Type.Optional(ListEpisodesFiltersDto),
}, { additionalProperties: false });

export type ListEpisodesInputDto = Static<typeof ListEpisodesInputDto>;
