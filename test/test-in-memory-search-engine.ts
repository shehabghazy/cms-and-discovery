// Basic test for InMemorySearchEngine to verify functionality

import { InMemorySearchEngine } from '../src/shared/infrastructure/search-engine/in-memory-search-engine.js';

/**
 * Simple test runner for InMemorySearchEngine
 */
export async function testInMemorySearchEngine(): Promise<void> {
  const engine = new InMemorySearchEngine();
  
  console.log('🧪 Testing InMemorySearchEngine...');
  
  try {
    // Test index creation
    await engine.ensureIndex('test-index');
    console.log('✅ Index creation successful');
    
    // Test document indexing
    const testDoc1 = { id: '1', title: 'First Document', category: 'tech' };
    const testDoc2 = { id: '2', title: 'Second Document', category: 'science' };
    
    await engine.index('test-index', testDoc1);
    await engine.index('test-index', testDoc2);
    console.log('✅ Document indexing successful');
    
    // Test deletion
    await engine.delete('test-index', ['1']);
    console.log('✅ Document deletion successful');
    
    // Test refresh (no-op)
    await engine.refresh('test-index');
    console.log('✅ Refresh successful');
    
    // Test refresh all (no-op)
    await engine.refresh();
    console.log('✅ Refresh all successful');
    
    console.log('🎉 All interface method tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Export for use in other test files
export { testInMemorySearchEngine as default };
