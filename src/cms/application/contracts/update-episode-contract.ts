import { Type, Static } from '@sinclair/typebox';

// Episode update input schema (patch method - only updatable fields)
export const EpisodeUpdateDto = Type.Object({
  title: Type.Optional(Type.String({ minLength: 10, maxLength: 120 })),
  description: Type.Optional(Type.Union([Type.String({ maxLength: 5000 }), Type.Null()])),
  cover: Type.Optional(Type.String({ format: 'uuid' })), // asset_id
  transcripts: Type.Optional(Type.Array(Type.String({ format: 'uuid' }))), // array of asset_id UUIDs
}, { additionalProperties: false });

export type EpisodeUpdateDto = Static<typeof EpisodeUpdateDto>;
