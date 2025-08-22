import { Type } from '@sinclair/typebox';

// Pagination metadata schema
export const PaginationMetaSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  limit: Type.Integer({ minimum: 1 }),
  total: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
  hasNextPage: Type.Boolean(),
  hasPreviousPage: Type.Boolean()
});

