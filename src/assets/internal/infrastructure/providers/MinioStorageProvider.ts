import { StorageProvider, FileInfo } from '../../domain/index.js';
import * as Minio from 'minio';
import * as crypto from 'crypto';

export type MinioStorageConfig = {
  type: 'minio';
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
};

/**
 * MinIO storage provider implementation for production use
 * Implements S3-compatible object storage using MinIO
 */
export class MinioStorageProvider implements StorageProvider {
  private readonly bucketName: string;

  constructor(
    protected readonly config: MinioStorageConfig,
    private readonly minioClient = new Minio.Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    })
  ) {
    this.bucketName = config.bucketName;
  }

  /**
   * Initialize the storage provider and ensure required resources exist.
   */
  async initialize(): Promise<void> {
    console.log(`🚀 Starting storage provider initialization...`);
    await this.bootstrapStorage();
    console.log(`🎉 Storage provider initialization completed`);
  }

  /**
   * Bootstrap storage resources (ensure bucket exists).
   * Called automatically during initialization.
   */
  private async bootstrapStorage(): Promise<void> {
    console.log(`🪣 Bootstrapping MinIO storage with bucket: ${this.bucketName}`);
    await this.ensureBucket();
    console.log(`✅ MinIO bucket ready`);
  }

  async upload(fileInfo: FileInfo): Promise<string> {
    // Generate a unique storage key
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const storageKey = `${timestamp}-${random}.${fileInfo.extension}`;
    
    // Upload file to MinIO
    await this.minioClient.putObject(
      this.bucketName,
      storageKey,
      fileInfo.buffer,
      fileInfo.size,
      {
        'Content-Type': fileInfo.mimeType,
        'Original-Name': fileInfo.name,
      }
    );
    
    return storageKey;
  }

  async download(storageKey: string): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(this.bucketName, storageKey);
      
      // Convert stream to buffer
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        
        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        
        stream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        
        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      // Check if it's a not found error
      if ((error as any).code === 'NoSuchKey' || (error as any).code === 'NotFound') {
        throw new Error(`File not found: ${storageKey}`);
      }
      throw error;
    }
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      await this.minioClient.removeObject(this.bucketName, storageKey);
      return true;
    } catch (error) {
      // Check if it's a not found error
      if ((error as any).code === 'NoSuchKey' || (error as any).code === 'NotFound') {
        return false; // File doesn't exist
      }
      throw error;
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, storageKey);
      return true;
    } catch (error) {
      // Check if it's a not found error
      if ((error as any).code === 'NoSuchKey' || (error as any).code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Ensure the bucket exists, create it if it doesn't
   */
  private async ensureBucket(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
      }
    } catch (error) {
      throw new Error(`Failed to ensure bucket exists: ${(error as Error).message}`);
    }
  }

  /**
   * Get the public URL for a file (if MinIO is configured for public access)
   * This is a bonus method not required by the StorageProvider interface
   */
  async getPublicUrl(storageKey: string, expiry: number = 7 * 24 * 60 * 60): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(this.bucketName, storageKey, expiry);
    } catch (error) {
      throw new Error(`Failed to generate public URL: ${(error as Error).message}`);
    }
  }

  /**
   * List all objects in the bucket (useful for debugging/admin)
   * This is a bonus method not required by the StorageProvider interface
   */
  async listObjects(prefix?: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const objects: string[] = [];
      const stream = this.minioClient.listObjects(this.bucketName, prefix, true);
      
      stream.on('data', (obj) => {
        if (obj.name) {
          objects.push(obj.name);
        }
      });
      
      stream.on('end', () => {
        resolve(objects);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }
}
