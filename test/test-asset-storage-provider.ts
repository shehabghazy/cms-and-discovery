import { LocalFileStorageProvider } from '../src/assets/infrastructure/index.js';
import type { FileInfo } from '../src/assets/domain/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

async function testStorageProvider(): Promise<void> {
  console.log('🚀 Testing Storage Provider\n');

  const testStorageDir = './test-uploads';
  const storageProvider = new LocalFileStorageProvider(testStorageDir);

  console.log('📁 Creating test file info...');
  const testContent = 'This is a test file content for storage provider testing.';
  const fileInfo: FileInfo = {
    name: 'test-file.txt',
    extension: 'txt',
    size: Buffer.byteLength(testContent),
    buffer: Buffer.from(testContent),
    mimeType: 'text/plain'
  };

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

  console.log('\n🧹 Cleaning up test directory...');
  try {
    await fs.rmdir(testStorageDir);
    console.log('✅ Test directory cleaned up');
  } catch (error) {
    console.log('⚠️ Test directory cleanup failed (may not exist)');
  }

  console.log('\n✅ Storage Provider tests completed successfully!\n');
}

// Run the test
testStorageProvider();
