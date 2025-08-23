import { Type, Static } from '@sinclair/typebox';

// Asset update availability input schema (for API)
export const AssetUpdateAvailabilityDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
  is_available: Type.Boolean(),
}, { additionalProperties: false });

export type AssetUpdateAvailabilityDto = Static<typeof AssetUpdateAvailabilityDto>;

// Re-export AssetDto for responses (shared across contracts)
export { AssetDto, type AssetDto as AssetUpdateAvailabilityResponseDto } from './upload-asset-contract.js';
