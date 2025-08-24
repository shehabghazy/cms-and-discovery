import { Asset } from '../src/assets/internal/domain/index.js';
import { InMemoryAssetRepository } from '../src/assets/internal/infrastructure/index.js';

async function testAssetRepository(): Promise<void> {
  console.log('🚀 Testing Asset Repository\n');

  const repository = new InMemoryAssetRepository();

  console.log('📁 Creating test assets...');
  const asset1 = Asset.create({
    name: 'document1.pdf',
    storage_key: 'uploads/doc1.pdf',
    extension: 'pdf',
    size: 1024
  });

  const asset2 = Asset.create({
    name: 'image1.jpg',
    storage_key: 'uploads/img1.jpg',
    extension: 'jpg',
    size: 2048
  });

  console.log('💾 Testing save operation...');
  await repository.save(asset1);
  await repository.save(asset2);
  console.log('✅ Assets saved successfully');

  console.log('\n🔍 Testing findById operation...');
  const foundAsset = await repository.findById(asset1.id);
  if (foundAsset) {
    console.log('✅ Found asset:', foundAsset.name);
  } else {
    console.log('❌ Asset not found');
  }

  console.log('\n🔍 Testing findById with non-existent ID...');
  const notFoundAsset = await repository.findById('non-existent-id');
  if (!notFoundAsset) {
    console.log('✅ Correctly returned null for non-existent asset');
  } else {
    console.log('❌ Should have returned null');
  }

  console.log('\n✏️ Testing update operation...');
  asset1.updateAvailability({ id: asset1.id, is_available: false });
  await repository.update(asset1);
  const updatedAsset = await repository.findById(asset1.id);
  if (updatedAsset && !updatedAsset.is_available) {
    console.log('✅ Asset updated successfully:', updatedAsset.is_available);
  } else {
    console.log('❌ Asset update failed');
  }

  console.log('\n🔍 Testing existsByStorageKey operation...');
  const exists = await repository.existsByStorageKey('uploads/doc1.pdf');
  if (exists) {
    console.log('✅ Storage key exists');
  } else {
    console.log('❌ Storage key should exist');
  }

  const notExists = await repository.existsByStorageKey('non-existent-key');
  if (!notExists) {
    console.log('✅ Non-existent storage key correctly returns false');
  } else {
    console.log('❌ Should return false for non-existent key');
  }

  console.log('\n🗑️ Testing delete operation...');
  const deleted = await repository.delete(asset2.id);
  if (deleted) {
    console.log('✅ Asset deleted successfully');
  } else {
    console.log('❌ Asset deletion failed');
  }

  const deletedAsset = await repository.findById(asset2.id);
  if (!deletedAsset) {
    console.log('✅ Deleted asset not found (correct behavior)');
  } else {
    console.log('❌ Deleted asset should not be found');
  }

  console.log('\n🗑️ Testing delete with non-existent ID...');
  const notDeleted = await repository.delete('non-existent-id');
  if (!notDeleted) {
    console.log('✅ Correctly returned false for non-existent asset deletion');
  } else {
    console.log('❌ Should return false for non-existent asset');
  }

  console.log('\n✅ Asset Repository tests completed successfully!\n');
}

// Run the test
testAssetRepository();
