import { Type, Static } from '@sinclair/typebox';

// Asset download input schema (for API)
export const AssetDownloadDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
}, { additionalProperties: false });

export type AssetDownloadDto = Static<typeof AssetDownloadDto>;
