import { 
  UploadAssetUseCase,
  GetAssetDetailsUseCase,
  UpdateAssetAvailabilityUseCase,
  DownloadAssetUseCase
} from '../src/assets/application/index.js';
import { InMemoryAssetRepository, LocalFileStorageProvider } from '../src/assets/infrastructure/index.js';
import type { FileInfo } from '../src/assets/domain/index.js';
import { NotFoundError, ValidationError } from '../src/shared/application/usecase-errors.js';

async function testAssetUseCases(): Promise<void> {
  console.log('🚀 Testing Asset Use Cases\n');

  const repository = new InMemoryAssetRepository();
  const storageProvider = new LocalFileStorageProvider('./test-uploads');

  console.log('📤 Testing UploadAssetUseCase...');
  const uploadUseCase = new UploadAssetUseCase(repository, storageProvider);
  
  const testContent = 'This is a test file for upload use case.';
  const fileInfo: FileInfo = {
    name: 'test-upload.txt',
    extension: 'txt',
    size: Buffer.byteLength(testContent),
    buffer: Buffer.from(testContent),
    mimeType: 'text/plain'
  };

  const uploadResult = await uploadUseCase.execute({ fileInfo });
  console.log('✅ Asset uploaded successfully:', uploadResult.asset.name);
  console.log('   - ID:', uploadResult.asset.id);
  console.log('   - Storage Key:', uploadResult.asset.storage_key);
  console.log('   - Size:', uploadResult.asset.size);
  console.log('   - Available:', uploadResult.asset.is_available);

  const assetId = uploadResult.asset.id;

  console.log('\n🔍 Testing GetAssetDetailsUseCase...');
  const getDetailsUseCase = new GetAssetDetailsUseCase(repository);
  const detailsResult = await getDetailsUseCase.execute({ assetId });
  console.log('✅ Asset details retrieved:', detailsResult.asset.name);
  console.log('   - Same ID:', detailsResult.asset.id === assetId);

  console.log('\n🔍 Testing GetAssetDetailsUseCase with non-existent ID...');
  try {
    await getDetailsUseCase.execute({ assetId: 'non-existent-id' });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('✅ Correctly threw NotFoundError:', error.message);
    } else {
      console.log('❌ Wrong error type:', error);
    }
  }

  console.log('\n✏️ Testing UpdateAssetAvailabilityUseCase...');
  const updateAvailabilityUseCase = new UpdateAssetAvailabilityUseCase(repository);
  const updateResult = await updateAvailabilityUseCase.execute({ 
    assetId, 
    isAvailable: false 
  });
  console.log('✅ Asset availability updated:', updateResult.asset.is_available);
  console.log('   - Updated at:', updateResult.asset.updated_at);

  console.log('\n✏️ Testing UpdateAssetAvailabilityUseCase with non-existent ID...');
  try {
    await updateAvailabilityUseCase.execute({ 
      assetId: 'non-existent-id', 
      isAvailable: true 
    });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('✅ Correctly threw NotFoundError:', error.message);
    } else {
      console.log('❌ Wrong error type:', error);
    }
  }

  console.log('\n📥 Testing DownloadAssetUseCase with unavailable asset...');
  const downloadUseCase = new DownloadAssetUseCase(repository, storageProvider);
  try {
    await downloadUseCase.execute({ assetId });
    console.log('❌ Should have thrown ValidationError for unavailable asset');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('✅ Correctly threw ValidationError:', error.message);
    } else {
      console.log('❌ Wrong error type:', error);
    }
  }

  console.log('\n📥 Making asset available and testing download...');
  await updateAvailabilityUseCase.execute({ assetId, isAvailable: true });
  const downloadResult = await downloadUseCase.execute({ assetId });
  console.log('✅ Asset downloaded successfully');
  console.log('   - File name:', downloadResult.fileName);
  console.log('   - MIME type:', downloadResult.mimeType);
  console.log('   - Size:', downloadResult.size);
  console.log('   - Content matches:', downloadResult.fileBuffer.toString() === testContent);

  console.log('\n📥 Testing DownloadAssetUseCase with non-existent ID...');
  try {
    await downloadUseCase.execute({ assetId: 'non-existent-id' });
    console.log('❌ Should have thrown NotFoundError');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('✅ Correctly threw NotFoundError:', error.message);
    } else {
      console.log('❌ Wrong error type:', error);
    }
  }

  console.log('\n🧹 Cleaning up...');
  try {
    await storageProvider.delete(uploadResult.asset.storage_key);
    console.log('✅ Test file cleaned up');
  } catch (error) {
    console.log('⚠️ Cleanup failed:', (error as Error).message);
  }

  console.log('\n✅ Asset Use Cases tests completed successfully!\n');
}

// Run the test
testAssetUseCases();
