import { Asset, type AssetRepository } from '../../domain/index.js';

/**
 * In-memory repository implementation for development/testing
 * In production, this would be replaced with a database implementation
 */
export class InMemoryAssetRepository implements AssetRepository {
  private readonly assets = new Map<string, Asset>();
  private readonly storageKeyIndex = new Map<string, string>(); // storage_key -> id mapping for O(1) lookups

  async save(asset: Asset): Promise<void> {
    // Update both maps atomically
    this.assets.set(asset.id, asset);
    this.storageKeyIndex.set(asset.storage_key, asset.id);
  }

  async findById(id: string): Promise<Asset | null> {
    return this.assets.get(id) || null;
  }

  async update(asset: Asset): Promise<void> {
    if (!this.assets.has(asset.id)) {
      return; // Asset doesn't exist, nothing to update
    }
    
    // Update both maps atomically
    this.assets.set(asset.id, asset);
    this.storageKeyIndex.set(asset.storage_key, asset.id);
  }

  async delete(id: string): Promise<boolean> {
    const asset = this.assets.get(id);
    if (!asset) {
      return false;
    }
    
    // Remove from both maps atomically
    this.assets.delete(id);
    this.storageKeyIndex.delete(asset.storage_key);
    
    return true;
  }

  async existsByStorageKey(storageKey: string, excludeId?: string): Promise<boolean> {
    const existingId = this.storageKeyIndex.get(storageKey);
    if (!existingId) {
      return false;
    }
    
    // If excludeId is provided and matches the existing ID, consider it as not existing
    return excludeId ? existingId !== excludeId : true;
  }
}
