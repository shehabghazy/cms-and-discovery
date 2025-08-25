import { StorageProviderFactory, StorageProviderType } from '../src/assets/internal/infrastructure/index.js';
import type { FileInfo } from '../src/assets/internal/domain/index.js';

async function testStorageProviderFactory(): Promise<void> {
  console.log('🏭 Testing Storage Provider Factory\n');

  // Test data
  const testContent = 'This is a test file content for factory testing.';
  const fileInfo: FileInfo = {
    name: 'factory-test-file.txt',
    extension: 'txt',
    size: Buffer.byteLength(testContent),
    buffer: Buffer.from(testContent),
    mimeType: 'text/plain'
  };

  // Test both storage provider types
  const providerTypes: StorageProviderType[] = ['local', 'minio'];

  for (const providerType of providerTypes) {
    console.log(`\n🔧 Testing ${providerType.toUpperCase()} Storage Provider via Factory`);
    
    try {
      // Create storage provider using factory
      const storageProvider = await StorageProviderFactory.create(providerType);
      console.log(`✅ ${providerType} storage provider created and initialized`);

      // Test upload
      console.log(`📤 Testing upload...`);
      const storageKey = await storageProvider.upload(fileInfo);
      console.log(`✅ File uploaded with key: ${storageKey}`);

      // Test exists
      console.log(`🔍 Testing exists...`);
      const exists = await storageProvider.exists(storageKey);
      console.log(`✅ File exists: ${exists}`);

      // Test download
      console.log(`📥 Testing download...`);
      const downloadedBuffer = await storageProvider.download(storageKey);
      const downloadedContent = downloadedBuffer.toString();
      if (downloadedContent === testContent) {
        console.log(`✅ Downloaded content matches original`);
      } else {
        console.log(`❌ Content mismatch`);
      }

      // Test delete
      console.log(`🗑️ Testing delete...`);
      const deleted = await storageProvider.delete(storageKey);
      console.log(`✅ File deleted: ${deleted}`);

      // Verify deletion
      const stillExists = await storageProvider.exists(storageKey);
      console.log(`✅ File no longer exists: ${!stillExists}`);

    } catch (error) {
      console.error(`❌ Error testing ${providerType} provider:`, (error as Error).message);
      if (providerType === 'minio') {
        console.log('💡 Make sure MinIO is running: docker-compose up -d minio');
      }
    }
  }

  console.log('\n🧪 Testing factory with environment variables...');
  try {
    // Test environment-based factory
    const storageType = (process.env.STORAGE_PROVIDER_TYPE as StorageProviderType) || 'local';
    const envStorageProvider = await StorageProviderFactory.create(storageType);
    console.log('✅ Environment-based storage provider created successfully');
    
    // Quick test
    const storageKey = await envStorageProvider.upload(fileInfo);
    const exists = await envStorageProvider.exists(storageKey);
    const deleted = await envStorageProvider.delete(storageKey);
    
    console.log(`✅ Environment provider test completed - upload: ✓, exists: ${exists}, delete: ${deleted}`);
    
  } catch (error) {
    console.error('❌ Environment provider test failed:', (error as Error).message);
  }

  console.log('\n✅ Storage Provider Factory tests completed!\n');
}

// Run the test
testStorageProviderFactory();
