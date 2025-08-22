import { Type, Static } from '@sinclair/typebox';
import { ProgramType, ProgramStatus } from './shared-types.js';

// Program create input schema (for API)
export const ProgramCreateDto = Type.Object({
  title: Type.String({ minLength: 10, maxLength: 120 }),
  type: ProgramType,
  slug: Type.String({ pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 80 }),
  description: Type.Optional(Type.Union([Type.String({ maxLength: 5000 }), Type.Null()])),
  cover: Type.Optional(Type.Union([Type.String(), Type.Null()])), // asset_id
  language: Type.Optional(Type.String({ pattern: '^[a-z]{2}$' })), // ISO-639-1, defaults to 'ar'
}, { additionalProperties: false });

export type ProgramCreateDto = Static<typeof ProgramCreateDto>;

// Program output schema (for API responses)
export const ProgramDto = Type.Object({
  id: Type.String(),
  title: Type.String(),
  type: ProgramType,
  slug: Type.String(),
  status: ProgramStatus,
  description: Type.Union([Type.String(), Type.Null()]),
  cover: Type.Union([Type.String(), Type.Null()]), // asset_id
  language: Type.String(),
  published_at: Type.Union([Type.String(), Type.Null()]), // ISO string when published
  created_at: Type.String(),
  updated_at: Type.Union([Type.String(), Type.Null()]),
}, { additionalProperties: false });

export type ProgramDto = Static<typeof ProgramDto>;
