import { Type } from '@sinclair/typebox';
import { ProgramDto } from './create-program-contract.js';
import { PaginationMetaSchema } from '../../../shared/index.js';

// Query parameters for listing programs with pagination
export const ListProgramsQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  status: Type.Optional(Type.Union([
    Type.Literal('draft'),
    Type.Literal('published'),
    Type.Literal('archived')
  ])),
  type: Type.Optional(Type.Union([
    Type.Literal('podcast'),
    Type.Literal('course'),
    Type.Literal('series')
  ])),
  search: Type.Optional(Type.String({ minLength: 1, maxLength: 100 }))
});

// Response schema for list programs
export const ListProgramsResponse = Type.Object({
  programs: Type.Array(ProgramDto),
  pagination: PaginationMetaSchema
});
