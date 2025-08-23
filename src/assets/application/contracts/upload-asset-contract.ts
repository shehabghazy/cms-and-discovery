import { Type, Static } from '@sinclair/typebox';

// Note: Asset upload input is handled via multipart form data in the API layer
// The schema is defined directly in the route for proper Swagger documentation

// Asset output schema (for API responses)
export const AssetDto = Type.Object({
  id: Type.String(),
  name: Type.String(),
  storage_key: Type.String(),
  extension: Type.String(),
  size: Type.Number(),
  created_at: Type.String(), // ISO string
  updated_at: Type.Union([Type.String(), Type.Null()]), // ISO string or null
  last_access: Type.Union([Type.String(), Type.Null()]), // ISO string or null
  is_available: Type.Boolean(),
}, { additionalProperties: false });

export type AssetDto = Static<typeof AssetDto>;
