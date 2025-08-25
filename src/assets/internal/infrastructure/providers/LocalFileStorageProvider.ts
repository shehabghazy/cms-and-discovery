import { StorageProvider, FileInfo } from '../../domain/index.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

export type LocalFileStorageConfig = {
  type: 'local';
  storageDirectory: string;
};

/**
 * Local file system storage provider implementation for development/testing
 * In production, this would be replaced with cloud storage (AWS S3, Azure Blob, etc.)
 */
export class LocalFileStorageProvider implements StorageProvider {
  private readonly storageDirectory: string;

  constructor(
    protected readonly config: LocalFileStorageConfig
  ) {
    this.storageDirectory = path.resolve(config.storageDirectory);
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
   * Bootstrap storage resources (ensure directory exists).
   * Called automatically during initialization.
   */
  private async bootstrapStorage(): Promise<void> {
    console.log(`📁 Bootstrapping local file storage at: ${this.storageDirectory}`);
    await this.ensureStorageDirectory();
    console.log(`✅ Local storage directory ready`);
  }

  async upload(fileInfo: FileInfo): Promise<string> {
    // Generate a unique storage key
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const storageKey = `${timestamp}-${random}.${fileInfo.extension}`;
    
    // Write file to storage directory
    const filePath = path.join(this.storageDirectory, storageKey);
    await fs.writeFile(filePath, fileInfo.buffer);
    
    return storageKey;
  }

  async download(storageKey: string): Promise<Buffer> {
    const filePath = path.join(this.storageDirectory, storageKey);
    
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${storageKey}`);
      }
      throw error;
    }
  }

  async delete(storageKey: string): Promise<boolean> {
    const filePath = path.join(this.storageDirectory, storageKey);
    
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false; // File doesn't exist
      }
      throw error;
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    const filePath = path.join(this.storageDirectory, storageKey);
    
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.storageDirectory, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore EEXIST error
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }
  }
}
