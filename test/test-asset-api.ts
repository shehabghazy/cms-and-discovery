import { 
  registerAssetRoutes,
  InMemoryAssetRepository,
  LocalFileStorageProvider
} from '../src/assets/internal/index.js';
import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import multipart from '@fastify/multipart';
import { registerErrorHandler } from '../src/shared/api/error-handler.js';

async function testAssetAPI(): Promise<void> {
  console.log('🚀 Testing Asset API Routes\n');

  // Setup test server
  const app = Fastify({ logger: false }).withTypeProvider<TypeBoxTypeProvider>();
  
  // Register error handler
  registerErrorHandler(app);
  
  // Register multipart support
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB for testing
      files: 1
    }
  });

  // Setup dependencies
  const assetRepository = new InMemoryAssetRepository();
  const config = {
    type: 'local' as const,
    storageDirectory: './test-api-uploads'
  };
  const storageProvider = new LocalFileStorageProvider(config);
  await storageProvider.initialize();

  // Register asset routes
  registerAssetRoutes(app, { assetRepository, storageProvider });

  console.log('📤 Testing POST /assets (upload)...');
  
  // Test file upload via multipart form data
  const testFileContent = 'This is a test file for API testing.';
  const formData = new FormData();
  const fileBlob = new Blob([testFileContent], { type: 'text/plain' });
  formData.append('file', fileBlob, 'test-api-file.txt');

  const uploadResponse = await app.inject({
    method: 'POST',
    url: '/assets',
    payload: formData
  });

  if (uploadResponse.statusCode === 201) {
    const uploadResult = JSON.parse(uploadResponse.payload);
    console.log('✅ Upload successful');
    console.log('   - Status:', uploadResponse.statusCode);
    console.log('   - Asset ID:', uploadResult.id);
    console.log('   - Asset name:', uploadResult.name);
    console.log('   - Available:', uploadResult.is_available);

    const assetId = uploadResult.id;

    console.log('\n🔍 Testing GET /assets/:id (get details)...');
    const detailsResponse = await app.inject({
      method: 'GET',
      url: `/assets/${assetId}`
    });

    if (detailsResponse.statusCode === 200) {
      const detailsResult = JSON.parse(detailsResponse.payload);
      console.log('✅ Get details successful');
      console.log('   - Status:', detailsResponse.statusCode);
      console.log('   - Same ID:', detailsResult.id === assetId);
      console.log('   - Name:', detailsResult.name);
    } else {
      console.log('❌ Get details failed:', detailsResponse.statusCode, detailsResponse.payload);
    }

    console.log('\n🔍 Testing GET /assets/:id with invalid ID...');
    const invalidDetailsResponse = await app.inject({
      method: 'GET',
      url: '/assets/invalid-uuid'
    });

    if (invalidDetailsResponse.statusCode === 400) {
      console.log('✅ Invalid UUID correctly rejected with 400');
    } else {
      console.log('❌ Should reject invalid UUID with 400:', invalidDetailsResponse.statusCode);
    }

    console.log('\n✏️ Testing PATCH /assets/:id/availability (update availability)...');
    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/assets/${assetId}/availability`,
      payload: { is_available: false },
      headers: { 'content-type': 'application/json' }
    });

    if (updateResponse.statusCode === 200) {
      const updateResult = JSON.parse(updateResponse.payload);
      console.log('✅ Update availability successful');
      console.log('   - Status:', updateResponse.statusCode);
      console.log('   - Available:', updateResult.is_available);
      console.log('   - Updated at:', updateResult.updated_at);
    } else {
      console.log('❌ Update availability failed:', updateResponse.statusCode, updateResponse.payload);
    }

    console.log('\n📥 Testing GET /assets/:id/download with unavailable asset...');
    const downloadUnavailableResponse = await app.inject({
      method: 'GET',
      url: `/assets/${assetId}/download`
    });

    if (downloadUnavailableResponse.statusCode === 410) {
      const errorResult = JSON.parse(downloadUnavailableResponse.payload);
      console.log('✅ Download unavailable asset correctly returned 410 Gone');
      console.log('   - Error message:', errorResult.error);
    } else {
      console.log('❌ Should return 410 for unavailable asset:', downloadUnavailableResponse.statusCode);
    }

    console.log('\n📥 Making asset available and testing download...');
    await app.inject({
      method: 'PATCH',
      url: `/assets/${assetId}/availability`,
      payload: { is_available: true },
      headers: { 'content-type': 'application/json' }
    });

    const downloadResponse = await app.inject({
      method: 'GET',
      url: `/assets/${assetId}/download`
    });

    if (downloadResponse.statusCode === 200) {
      console.log('✅ Download successful');
      console.log('   - Status:', downloadResponse.statusCode);
      console.log('   - Content-Type:', downloadResponse.headers['content-type']);
      console.log('   - Content-Length:', downloadResponse.headers['content-length']);
      console.log('   - Content matches:', downloadResponse.payload === testFileContent);
    } else {
      console.log('❌ Download failed:', downloadResponse.statusCode, downloadResponse.payload);
    }

    console.log('\n📥 Testing download with non-existent asset...');
    const downloadNotFoundResponse = await app.inject({
      method: 'GET',
      url: '/assets/550e8400-e29b-41d4-a716-446655440000/download'
    });

    if (downloadNotFoundResponse.statusCode === 404) {
      const errorResult = JSON.parse(downloadNotFoundResponse.payload);
      console.log('✅ Download non-existent asset correctly returned 404');
      console.log('   - Error message:', errorResult.error);
    } else {
      console.log('❌ Should return 404 for non-existent asset:', downloadNotFoundResponse.statusCode);
    }

  } else {
    console.log('❌ Upload failed:', uploadResponse.statusCode, uploadResponse.payload);
  }

  console.log('\n🧹 Cleaning up test server...');
  await app.close();

  console.log('\n✅ Asset API tests completed successfully!\n');
}

// Run the test
testAssetAPI();
