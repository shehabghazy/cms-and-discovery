import { Type, Static } from '@sinclair/typebox';

// Episode change status input schema
export const EpisodeChangeStatusDto = Type.Object({
  status: Type.Union([
    Type.Literal('published'),
    Type.Literal('hidden'),
  ]),
}, { additionalProperties: false });

export type EpisodeChangeStatusDto = Static<typeof EpisodeChangeStatusDto>;
