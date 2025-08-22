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

export const EpisodeStatus = Type.Union([
  Type.Literal('draft'),
  Type.Literal('published'),
  Type.Literal('hidden'),
]);

export const EpisodeKind = Type.Union([
  Type.Literal('audio'),
  Type.Literal('video'),
]);
