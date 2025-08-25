// Simple factory for creating and initializing storage provider instances

import { StorageProvider } from '../domain/index.js';
import { LocalFileStorageProvider, type LocalFileStorageConfig } from './providers/LocalFileStorageProvider.js';
import { MinioStorageProvider, type MinioStorageConfig } from './providers/MinioStorageProvider.js';

export type StorageProviderType = 'local' | 'minio';

/**
 * Simple factory for creating and initializing storage provider instances
 */
export class StorageProviderFactory {
  /**
   * Create a storage provider instance of the specified type
   * @param type - The type of storage provider to create
   * @returns Initialized storage provider instance
   */
  static async create(type: StorageProviderType): Promise<StorageProvider> {
    console.log(`📦 Initializing storage provider: ${type}`);
    let storageProvider: StorageProvider;

    switch (type) {
      case 'local':
        const localConfig: LocalFileStorageConfig = {
          type: 'local',
          storageDirectory: process.env.LOCAL_STORAGE_DIRECTORY || './uploads'
        };
        storageProvider = new LocalFileStorageProvider(localConfig);
        break;
      case 'minio':
        const secretKey = process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD;
        if (!secretKey) {
          throw new Error('MINIO_SECRET_KEY or MINIO_ROOT_PASSWORD environment variable is required for MinIO storage');
        }
        
        const minioConfig: MinioStorageConfig = {
          type: 'minio',
          endPoint: process.env.MINIO_ENDPOINT || 'localhost',
          port: parseInt(process.env.MINIO_PORT || '9000', 10),
          useSSL: process.env.MINIO_USE_SSL === 'true',
          accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
          secretKey,
          bucketName: process.env.MINIO_BUCKET_NAME || 'assets'
        };
        storageProvider = new MinioStorageProvider(minioConfig);
        break;
      default:
        throw new Error(`Unsupported storage provider type: ${type}`);
    }

    console.log(`⚡ Bootstrapping ${type} storage provider...`);
    await storageProvider.initialize();
    console.log(`✅ Storage provider ${type} initialized and ready`);
    
    return storageProvider;
  }
}
