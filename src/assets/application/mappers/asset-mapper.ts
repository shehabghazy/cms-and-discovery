import { Asset } from '../../domain/asset.js';
import type { AssetDto } from '../contracts/upload-asset-contract.js';

export const toAssetDto = (asset: Asset): AssetDto => ({
  id: asset.id,
  name: asset.name,
  storage_key: asset.storage_key,
  extension: asset.extension,
  size: asset.size,
  created_at: asset.created_at.toISOString(),
  updated_at: asset.updated_at?.toISOString() ?? null,
  last_access: asset.last_access?.toISOString() ?? null,
  is_available: asset.is_available,
});

export const toAssetDtoArray = (assets: Asset[]): AssetDto[] => 
  assets.map(toAssetDto);
