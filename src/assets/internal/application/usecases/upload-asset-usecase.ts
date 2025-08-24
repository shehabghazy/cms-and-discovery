import { CommandUseCase } from '../../../../shared/index.js';
import type { AssetDto } from '../contracts/upload-asset-contract.js';
import { Asset, type AssetRepository, type StorageProvider, type FileInfo } from '../../domain/index.js';
import { toAssetDto } from '../mappers/asset-mapper.js';

export type UploadAssetInput = { 
  fileInfo: FileInfo;
};

export type UploadAssetOutput = { 
  asset: AssetDto;
};

export class UploadAssetUseCase extends CommandUseCase<UploadAssetInput, UploadAssetOutput> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly storageProvider: StorageProvider
  ) {
    super();
  }
  
  async execute(input: UploadAssetInput): Promise<UploadAssetOutput> {
    const { fileInfo } = input;
    
    // Upload file to storage provider first
    const storageKey = await this.storageProvider.upload(fileInfo);
    
    try {
      // Create asset domain entity with domain validation
      const asset = Asset.create({
        name: fileInfo.name,
        storage_key: storageKey,
        extension: fileInfo.extension,
        size: fileInfo.size
      });
      
      // Save to repository
      await this.assetRepository.save(asset);
      
      return { asset: toAssetDto(asset) };
    } catch (error) {
      // If asset creation/saving fails, clean up the uploaded file
      await this.storageProvider.delete(storageKey);
      throw error;
    }
  }
}
