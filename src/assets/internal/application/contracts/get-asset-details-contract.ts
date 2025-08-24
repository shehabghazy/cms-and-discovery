import { Type, Static } from '@sinclair/typebox';

// Asset get details input schema (for API)
export const AssetGetDetailsDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
}, { additionalProperties: false });

export type AssetGetDetailsDto = Static<typeof AssetGetDetailsDto>;

// Re-export AssetDto for responses (shared across contracts)
export { AssetDto, type AssetDto as AssetDetailsResponseDto } from './upload-asset-contract.js';
