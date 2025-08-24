import { Type, Static } from '@sinclair/typebox';

// Episode move to program input schema
export const EpisodeMoveToProgram = Type.Object({
  program_id: Type.String({ format: 'uuid' }),
  slug: Type.String({ pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 80 }),
}, { additionalProperties: false });

export type EpisodeMoveToProgram = Static<typeof EpisodeMoveToProgram>;
