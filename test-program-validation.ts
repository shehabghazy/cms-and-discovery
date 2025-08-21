import { Program, ProgramType, ProgramStatus } from './cms/domain/index.js';

function testProgramValidation(): void {
  console.log('🧪 Testing Program Validation\n');

  // Test 1: Invalid UUID
  console.log('1. Testing invalid UUID...');
  try {
    Program.create({
      id: 'invalid-id',
      title: 'Test Program',
      type: ProgramType.PODCAST,
      slug: 'test-program'
    });
    console.log('❌ Should have failed');
  } catch (error: any) {
    console.log('✅ Correctly caught:', error.message);
  }

  // Test 2: Empty title
  console.log('\n2. Testing empty title...');
  try {
    Program.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: '   ',
      type: ProgramType.PODCAST,
      slug: 'test-program'
    });
    console.log('❌ Should have failed');
  } catch (error: any) {
    console.log('✅ Correctly caught:', error.message);
  }

  // Test 3: Invalid slug
  console.log('\n3. Testing invalid slug...');
  try {
    Program.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Program',
      type: ProgramType.PODCAST,
      slug: 'Invalid Slug With Spaces!'
    });
    console.log('❌ Should have failed');
  } catch (error: any) {
    console.log('✅ Correctly caught:', error.message);
  }

  // Test 4: Multiple validation errors
  console.log('\n4. Testing multiple validation errors...');
  try {
    Program.create({
      id: 'bad-id',
      title: '',
      type: ProgramType.PODCAST,
      slug: 'Bad Slug!'
    });
    console.log('❌ Should have failed');
  } catch (error: any) {
    console.log('✅ Correctly caught multiple errors:', error.message);
  }

  // Test 5: Valid program creation
  console.log('\n5. Testing valid program creation...');
  try {
    const program = Program.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Valid Program',
      type: ProgramType.PODCAST,
      slug: 'valid-program-slug'
    });
    console.log('✅ Program created successfully:', program.title);
  } catch (error: any) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n✅ Program validation tests completed!');
}

testProgramValidation();
