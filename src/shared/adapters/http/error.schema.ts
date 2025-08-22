// schemas/error.schema.ts
import { Type } from '@sinclair/typebox';

export const ErrorSchema = Type.Object({
  error: Type.String(),
  details: Type.Optional(Type.Array(Type.String())),
});
