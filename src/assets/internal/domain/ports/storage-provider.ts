/**
 * File information extracted from uploaded file
 */
export interface FileInfo {
  name: string;
  extension: string;
  size: number;
  buffer: Buffer;
  mimeType: string;
}

/**
 * Storage provider interface for handling file uploads and downloads
 * This is a port (interface) that defines the contract for storage operations
 * Implementations will be provided in the infrastructure layer
 */
export interface StorageProvider {
  /**
   * Upload a file to the storage provider
   * @param fileInfo - Information about the file to upload
   * @returns Promise that resolves to the storage key for the uploaded file
   */
  upload(fileInfo: FileInfo): Promise<string>;

  /**
   * Download a file from the storage provider
   * @param storageKey - The storage key of the file to download
   * @returns Promise that resolves to the file buffer
   */
  download(storageKey: string): Promise<Buffer>;

  /**
   * Delete a file from the storage provider
   * @param storageKey - The storage key of the file to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  delete(storageKey: string): Promise<boolean>;

  /**
   * Check if a file exists in the storage provider
   * @param storageKey - The storage key to check
   * @returns Promise that resolves to true if exists, false otherwise
   */
  exists(storageKey: string): Promise<boolean>;
}
