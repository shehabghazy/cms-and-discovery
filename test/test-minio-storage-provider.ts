import { MinioStorageProvider, type MinioStorageConfig } from '../src/assets/internal/infrastructure/index.js';
import type { FileInfo } from '../src/assets/internal/domain/index.js';

async function testMinioStorageProvider(): Promise<void> {
  console.log('🚀 Testing MinIO Storage Provider\n');

  // MinIO configuration via explicit config object
  const config: MinioStorageConfig = {
    type: 'minio',
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'APq9.BiJs809lZdXHo32jndHI1C^',
    bucketName: 'test-assets'
  };
  const storageProvider = new MinioStorageProvider(config);

  // Initialize the storage provider
  await storageProvider.initialize();

  console.log('📁 Creating test file info...');
  const testContent = 'This is a test file content for MinIO storage provider testing.';
  const fileInfo: FileInfo = {
    name: 'test-file.txt',
    extension: 'txt',
    size: Buffer.byteLength(testContent),
    buffer: Buffer.from(testContent),
    mimeType: 'text/plain'
  };

  try {
    console.log('📤 Testing upload operation...');
    const storageKey = await storageProvider.upload(fileInfo);
    console.log('✅ File uploaded with storage key:', storageKey);

    console.log('\n🔍 Testing exists operation...');
    const exists = await storageProvider.exists(storageKey);
    if (exists) {
      console.log('✅ File exists in storage');
    } else {
      console.log('❌ File should exist in storage');
    }

    console.log('\n📥 Testing download operation...');
    const downloadedBuffer = await storageProvider.download(storageKey);
    const downloadedContent = downloadedBuffer.toString();
    if (downloadedContent === testContent) {
      console.log('✅ Downloaded content matches original');
    } else {
      console.log('❌ Downloaded content does not match');
      console.log('Expected:', testContent);
      console.log('Actual:', downloadedContent);
    }

    console.log('\n🔍 Testing exists with non-existent file...');
    const notExists = await storageProvider.exists('non-existent-file.txt');
    if (!notExists) {
      console.log('✅ Non-existent file correctly returns false');
    } else {
      console.log('❌ Should return false for non-existent file');
    }

    console.log('\n📥 Testing download with non-existent file...');
    try {
      await storageProvider.download('non-existent-file.txt');
      console.log('❌ Should have thrown error for non-existent file');
    } catch (error) {
      console.log('✅ Correctly threw error for non-existent file:', (error as Error).message);
    }

    console.log('\n🔗 Testing public URL generation...');
    const publicUrl = await storageProvider.getPublicUrl(storageKey, 3600); // 1 hour expiry
    console.log('✅ Public URL generated:', publicUrl);

    console.log('\n📋 Testing list objects...');
    const objects = await storageProvider.listObjects();
    console.log('✅ Objects in bucket:', objects.length);
    console.log('Objects:', objects.slice(0, 5)); // Show first 5 objects

    console.log('\n🗑️ Testing delete operation...');
    const deleted = await storageProvider.delete(storageKey);
    if (deleted) {
      console.log('✅ File deleted successfully');
    } else {
      console.log('❌ File deletion failed');
    }

    const stillExists = await storageProvider.exists(storageKey);
    if (!stillExists) {
      console.log('✅ File no longer exists after deletion');
    } else {
      console.log('❌ File should not exist after deletion');
    }

    console.log('\n🗑️ Testing delete with non-existent file...');
    const notDeleted = await storageProvider.delete('non-existent-file.txt');
    if (!notDeleted) {
      console.log('✅ Correctly returned false for non-existent file deletion');
    } else {
      console.log('❌ Should return false for non-existent file');
    }

    console.log('\n✅ MinIO Storage Provider tests completed successfully!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n💡 Make sure MinIO is running: docker-compose up -d minio');
    process.exit(1);
  }
}

// Run the test
testMinioStorageProvider();
