import { Type, Static } from '@sinclair/typebox';

// Status change input schema (for API)
export const ProgramChangeStatusDto = Type.Object({
  status: Type.Union([
    Type.Literal('published'),
    Type.Literal('archived'),
  ]),
}, { additionalProperties: false });

export type ProgramChangeStatusDto = Static<typeof ProgramChangeStatusDto>;
