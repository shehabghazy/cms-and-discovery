// application/contracts/program.contract.ts
import { Type, Static } from '@sinclair/typebox';

export const ProgramType = Type.Union([
  Type.Literal('podcast'),
  Type.Literal('documentary'),
  Type.Literal('youtube'),
]);

export const ProgramStatus = Type.Union([
  Type.Literal('draft'),
  Type.Literal('published'),
  Type.Literal('archived'),
]);




export const ProgramCreateDto = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 120 }),
  type: ProgramType,
  slug: Type.String({ pattern: '^[a-z0-9-]+$' }),
  status: Type.Optional(ProgramStatus),
}, { additionalProperties: false });

export type ProgramCreateDto = Static<typeof ProgramCreateDto>;





export const ProgramDto = Type.Object({
  id: Type.String(),
  title: Type.String(),
  type: ProgramType,
  slug: Type.String(),
  status: ProgramStatus,
  created_at: Type.String(),
  updated_at: Type.Union([Type.String(), Type.Null()]),
}, { additionalProperties: false });

export type ProgramDto = Static<typeof ProgramDto>;
