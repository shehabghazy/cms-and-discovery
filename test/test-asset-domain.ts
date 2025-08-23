import { Asset } from '../src/assets/domain/index.js';
import { DomainValidationError } from '../src/shared/utilities/index.js';

function testAssetDomain(): void {
  console.log('🚀 Testing Asset Domain Entity\n');

  console.log('📁 Creating a valid Asset...');
  const asset: Asset = Asset.create({
    name: 'test-document.pdf',
    storage_key: 'uploads/1234567890-abcdef.pdf',
    extension: 'pdf',
    size: 1024
  });
  
  console.log('Asset created:', asset.toObject());
  console.log('✅ Asset ID:', asset.id);
  console.log('✅ Asset name:', asset.name);
  console.log('✅ Storage key:', asset.storage_key);
  console.log('✅ Extension:', asset.extension);
  console.log('✅ Size:', asset.size);
  console.log('✅ Is available:', asset.is_available);
  console.log('✅ Created at:', asset.created_at);
  console.log('✅ Last access:', asset.last_access);
  
  console.log('\n🔄 Testing asset availability update...');
  asset.updateAvailability({ id: asset.id, is_available: false });
  console.log('✅ Updated availability to false:', asset.is_available);
  console.log('✅ Updated at timestamp:', asset.updated_at);
  
  console.log('\n⏰ Testing access recording...');
  const beforeAccess = asset.last_access;
  asset.recordAccess();
  console.log('✅ Last access before:', beforeAccess);
  console.log('✅ Last access after:', asset.last_access);
  
  console.log('\n❌ Testing validation errors...');
  
  // Test invalid name (empty)
  try {
    Asset.create({
      name: '',
      storage_key: 'test-key',
      extension: 'pdf',
      size: 1024
    });
    console.log('❌ Should have thrown validation error for empty name');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Caught validation error for empty name:', error.issues[0].message);
    }
  }
  
  // Test invalid extension
  try {
    Asset.create({
      name: 'test.pdf',
      storage_key: 'test-key',
      extension: 'INVALID_EXT_TOO_LONG',
      size: 1024
    });
    console.log('❌ Should have thrown validation error for invalid extension');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Caught validation error for invalid extension:', error.issues[0].message);
    }
  }
  
  // Test invalid size
  try {
    Asset.create({
      name: 'test.pdf',
      storage_key: 'test-key',
      extension: 'pdf',
      size: -1
    });
    console.log('❌ Should have thrown validation error for negative size');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Caught validation error for negative size:', error.issues[0].message);
    }
  }
  
  console.log('\n✅ Asset Domain tests completed successfully!\n');
}

// Run the test
testAssetDomain();
