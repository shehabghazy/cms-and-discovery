import { InMemoryProgramRepository } from '../src/cms/infrastructure/index.js';

console.log('🚀 Testing List Programs API\n');

const API_BASE = 'http://localhost:3001';

// First, create some test programs
console.log('📝 Creating test programs...');
const programsToCreate = [
  {
    title: 'Advanced TypeScript Patterns',
    type: 'podcast',
    slug: 'advanced-typescript-patterns',
    description: 'Deep dive into TypeScript patterns',
    language: 'en'
  },
  {
    title: 'React Fundamentals Series',
    type: 'series',
    slug: 'react-fundamentals-series',
    description: 'Learn React from basics to advanced',
    language: 'en'
  },
  {
    title: 'Node.js Best Practices',
    type: 'podcast',
    slug: 'nodejs-best-practices',
    description: 'Production-ready Node.js tips',
    language: 'en'
  }
];

// Create programs
for (const program of programsToCreate) {
  try {
    const response = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program)
    });
    
    if (response.ok) {
      const result = await response.json() as any;
      console.log(`✅ Created: ${result.title}`);
    } else {
      console.log(`❌ Failed to create program: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error creating program: ${error}`);
  }
}

console.log('\n📋 Testing list programs API...');

// Test 1: List all programs
console.log('\n✅ Test 1: List all programs');
try {
  const response = await fetch(`${API_BASE}/programs`);
  const result = await response.json() as any;
  
  console.log(`Status: ${response.status}`);
  console.log(`Found: ${result.programs?.length || 0} programs`);
  console.log(`Total: ${result.pagination?.total || 0}`);
  console.log(`Page: ${result.pagination?.page || 0}/${result.pagination?.totalPages || 0}`);
} catch (error) {
  console.log(`❌ Error: ${error}`);
}

// Test 2: Pagination
console.log('\n✅ Test 2: Pagination (limit 2)');
try {
  const response = await fetch(`${API_BASE}/programs?limit=2&page=1`);
  const result = await response.json() as any;
  
  console.log(`Status: ${response.status}`);
  console.log(`Found: ${result.programs?.length || 0} programs on page 1`);
  console.log(`Has next page: ${result.pagination?.hasNextPage || false}`);
} catch (error) {
  console.log(`❌ Error: ${error}`);
}

// Test 3: Filter by type
console.log('\n✅ Test 3: Filter by type (podcast)');
try {
  const response = await fetch(`${API_BASE}/programs?type=podcast`);
  const result = await response.json() as any;
  
  console.log(`Status: ${response.status}`);
  console.log(`Found: ${result.programs?.length || 0} podcasts`);
  if (result.programs) {
    result.programs.forEach((p: any) => console.log(`   - ${p.title} (${p.type})`));
  }
} catch (error) {
  console.log(`❌ Error: ${error}`);
}

// Test 4: Search
console.log('\n✅ Test 4: Search for "typescript"');
try {
  const response = await fetch(`${API_BASE}/programs?search=typescript`);
  const result = await response.json() as any;
  
  console.log(`Status: ${response.status}`);
  console.log(`Found: ${result.programs?.length || 0} programs`);
  if (result.programs) {
    result.programs.forEach((p: any) => console.log(`   - ${p.title}`));
  }
} catch (error) {
  console.log(`❌ Error: ${error}`);
}

// Test 5: Combined filters
console.log('\n✅ Test 5: Combined filters (type=podcast&limit=1)');
try {
  const response = await fetch(`${API_BASE}/programs?type=podcast&limit=1`);
  const result = await response.json() as any;
  
  console.log(`Status: ${response.status}`);
  console.log(`Found: ${result.programs?.length || 0} programs`);
  console.log(`Pagination info:`, result.pagination);
} catch (error) {
  console.log(`❌ Error: ${error}`);
}

console.log('\n🎉 API tests completed!');
