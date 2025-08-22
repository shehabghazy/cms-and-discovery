import { Type, Static } from '@sinclair/typebox';
import { EpisodeKind, EpisodeStatus } from './shared-types.js';

// Episode create input schema (for API)
export const EpisodeCreateDto = Type.Object({
  program_id: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 10, maxLength: 120 }),
  slug: Type.String({ pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 80 }),
  kind: EpisodeKind,
  source: Type.String({ format: 'uuid' }), // asset_id - required, immutable
  description: Type.Optional(Type.Union([Type.String({ maxLength: 5000 }), Type.Null()])),
  cover: Type.Optional(Type.String({ format: 'uuid' })), // asset_id
  transcripts: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))), // array of asset_id UUIDs
}, { additionalProperties: false });

export type EpisodeCreateDto = Static<typeof EpisodeCreateDto>;

// Episode output schema (for API responses)
export const EpisodeDto = Type.Object({
  id: Type.String(),
  program_id: Type.String(),
  title: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  cover: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]), // asset_id
  transcripts: Type.Array(Type.String({ format: 'uuid' })), // array of asset_id UUIDs
  status: EpisodeStatus,
  published_at: Type.Union([Type.String(), Type.Null()]), // ISO string when published
  kind: EpisodeKind,
  source: Type.String({ format: 'uuid' }), // asset_id
  created_at: Type.String(),
  updated_at: Type.Union([Type.String(), Type.Null()]),
}, { additionalProperties: false });

export type EpisodeDto = Static<typeof EpisodeDto>;
