import { 
  validateAssetCreate,
  validateAssetGetDetails,
  validateAssetUpdateAvailability,
  validateAssetDownload
} from '../src/assets/internal/domain/index.js';
import { DomainValidationError } from '../src/shared/utilities/index.js';

function testAssetValidation(): void {
  console.log('🚀 Testing Asset Validation Functions\n');

  console.log('✅ Testing validateAssetCreate with valid input...');
  const validCreateInput = {
    name: 'test-document.pdf',
    storage_key: 'uploads/12345-abcdef.pdf',
    extension: 'pdf',
    size: 1024
  };

  try {
    const result = validateAssetCreate(validCreateInput);
    console.log('✅ Valid input passed validation');
    console.log('   - ID generated:', result.id);
    console.log('   - Name normalized:', result.name);
    console.log('   - Extension normalized:', result.extension);
    console.log('   - Default availability:', result.is_available);
  } catch (error) {
    console.log('❌ Valid input should not throw error:', error);
  }

  console.log('\n❌ Testing validateAssetCreate with invalid inputs...');

  // Test empty name
  try {
    validateAssetCreate({ ...validCreateInput, name: '' });
    console.log('❌ Empty name should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Empty name validation error:', error.issues[0].message);
    }
  }

  // Test name too long
  try {
    validateAssetCreate({ 
      ...validCreateInput, 
      name: 'a'.repeat(201) + '.pdf' 
    });
    console.log('❌ Long name should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Long name validation error:', error.issues[0].message);
    }
  }

  // Test empty storage key
  try {
    validateAssetCreate({ ...validCreateInput, storage_key: '' });
    console.log('❌ Empty storage key should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Empty storage key validation error:', error.issues[0].message);
    }
  }

  // Test invalid extension
  try {
    validateAssetCreate({ ...validCreateInput, extension: 'INVALID_EXT' });
    console.log('❌ Invalid extension should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Invalid extension validation error:', error.issues[0].message);
    }
  }

  // Test negative size
  try {
    validateAssetCreate({ ...validCreateInput, size: -1 });
    console.log('❌ Negative size should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Negative size validation error:', error.issues[0].message);
    }
  }

  // Test non-integer size
  try {
    validateAssetCreate({ ...validCreateInput, size: 10.5 });
    console.log('❌ Non-integer size should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Non-integer size validation error:', error.issues[0].message);
    }
  }

  console.log('\n✅ Testing validateAssetGetDetails...');
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  
  try {
    const result = validateAssetGetDetails({ id: validId });
    console.log('✅ Valid UUID passed validation:', result.id);
  } catch (error) {
    console.log('❌ Valid UUID should not throw error:', error);
  }

  try {
    validateAssetGetDetails({ id: 'invalid-uuid' });
    console.log('❌ Invalid UUID should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Invalid UUID validation error:', error.issues[0].message);
    }
  }

  console.log('\n✅ Testing validateAssetUpdateAvailability...');
  
  try {
    const result = validateAssetUpdateAvailability({ 
      id: validId, 
      is_available: false 
    });
    console.log('✅ Valid update availability input passed:', result.is_available);
  } catch (error) {
    console.log('❌ Valid input should not throw error:', error);
  }

  try {
    validateAssetUpdateAvailability({ 
      id: 'invalid-uuid', 
      is_available: true 
    });
    console.log('❌ Invalid UUID should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Invalid UUID validation error:', error.issues[0].message);
    }
  }

  try {
    validateAssetUpdateAvailability({ 
      id: validId, 
      is_available: 'not-boolean' as any 
    });
    console.log('❌ Non-boolean availability should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Non-boolean availability validation error:', error.issues[0].message);
    }
  }

  console.log('\n✅ Testing validateAssetDownload...');
  
  try {
    const result = validateAssetDownload({ id: validId });
    console.log('✅ Valid download input passed:', result.id);
  } catch (error) {
    console.log('❌ Valid input should not throw error:', error);
  }

  try {
    validateAssetDownload({ id: 'invalid-uuid' });
    console.log('❌ Invalid UUID should throw validation error');
  } catch (error) {
    if (error instanceof DomainValidationError) {
      console.log('✅ Invalid UUID validation error:', error.issues[0].message);
    }
  }

  console.log('\n✅ Asset Validation tests completed successfully!\n');
}

// Run the test
testAssetValidation();
