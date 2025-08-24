import { Type, Static } from '@sinclair/typebox';
import { ProgramType } from './shared-types.js';

// Program update input schema (for API)
export const ProgramUpdateDto = Type.Object({
  title: Type.Optional(Type.String({ minLength: 10, maxLength: 120 })),
  type: Type.Optional(ProgramType),
  description: Type.Optional(Type.Union([Type.String({ maxLength: 5000 }), Type.Null()])),
  cover: Type.Optional(Type.String({ format: 'uuid' })), // asset_id
  language: Type.Optional(Type.String({ pattern: '^[a-z]{2}$' })), // ISO-639-1
}, { additionalProperties: false });

export type ProgramUpdateDto = Static<typeof ProgramUpdateDto>;
