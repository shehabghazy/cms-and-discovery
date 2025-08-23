import { QueryUseCase } from '../../../shared/index.js';
import { type AssetRepository, type StorageProvider } from '../../domain/index.js';
import { NotFoundError, ValidationError } from '../../../shared/application/usecase-errors.js';

export type DownloadAssetInput = { 
  assetId: string;
};

export type DownloadAssetOutput = { 
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
};

export class DownloadAssetUseCase extends QueryUseCase<DownloadAssetInput, DownloadAssetOutput> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly storageProvider: StorageProvider
  ) {
    super();
  }
  
  async execute(input: DownloadAssetInput): Promise<DownloadAssetOutput> {
    const { assetId } = input;
    
    // Find asset by ID
    const asset = await this.assetRepository.findById(assetId);
    
    if (!asset) {
      throw new NotFoundError(`Asset with ID '${assetId}' not found`);
    }
    
    // Check if asset is available for download
    if (!asset.is_available) {
      throw new ValidationError('Asset is not available for download');
    }
    
    // Download file from storage provider
    const fileBuffer = await this.storageProvider.download(asset.storage_key);
    
    // Record access time
    asset.recordAccess();
    await this.assetRepository.update(asset);
    
    // Determine MIME type based on extension
    const mimeType = getMimeType(asset.extension);
    
    return {
      fileBuffer,
      fileName: asset.name,
      mimeType,
      size: asset.size
    };
  }
}

// Helper function to determine MIME type from extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'zip': 'application/zip',
    'json': 'application/json',
    'xml': 'application/xml'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}
