import { Asset } from '../asset.js';

/**
 * Repository interface for Asset domain entity
 * This is a port (interface) that defines the contract for data persistence
 * Implementations will be provided in the infrastructure layer
 */
export interface AssetRepository {
  /**
   * Save an asset entity to the data store
   * @param asset - The asset entity to save
   * @returns Promise that resolves when the asset is saved
   */
  save(asset: Asset): Promise<void>;

  /**
   * Find an asset by its unique identifier
   * @param id - The asset ID
   * @returns Promise that resolves to the asset or null if not found
   */
  findById(id: string): Promise<Asset | null>;

  /**
   * Update an existing asset
   * @param asset - The asset entity to update
   * @returns Promise that resolves when the asset is updated
   */
  update(asset: Asset): Promise<void>;

  /**
   * Delete an asset by its ID
   * @param id - The asset ID to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if an asset exists with the given storage key
   * @param storageKey - The storage key to check
   * @param excludeId - Optional ID to exclude from the check
   * @returns Promise that resolves to true if exists, false otherwise
   */
  existsByStorageKey(storageKey: string, excludeId?: string): Promise<boolean>;
}
