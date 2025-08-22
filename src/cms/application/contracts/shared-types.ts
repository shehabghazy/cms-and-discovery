import { Type } from '@sinclair/typebox';

export const ProgramType = Type.Union([
  Type.Literal('podcast'),
  Type.Literal('documentary'),
  Type.Literal('youtube'),
  Type.Literal('series'),
]);

export const ProgramStatus = Type.Union([
  Type.Literal('draft'),
  Type.Literal('published'),
  Type.Literal('archived'),
]);
