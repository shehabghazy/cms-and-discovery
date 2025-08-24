// Simple JavaScript test for Episode API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function httpRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${data.message || 'Unknown error'}`);
      throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

async function testCompleteEpisodeApiCycle() {
  console.log('🧪 Testing Complete Episode API Cycle\n');

  try {
    // Step 1: Create test programs
    console.log('📚 Step 1: Creating test programs...');
    
    const program1Data = {
      name: 'Software Architecture',
      description: 'Learn about software architecture patterns',
      tags: ['architecture', 'software', 'design']
    };

    const program2Data = {
      name: 'Advanced Programming',
      description: 'Advanced programming concepts',
      tags: ['programming', 'advanced']
    };

    const program1 = await httpRequest(`${BASE_URL}/cms/programs`, {
      method: 'POST',
      body: JSON.stringify(program1Data)
    });

    const program2 = await httpRequest(`${BASE_URL}/cms/programs`, {
      method: 'POST',
      body: JSON.stringify(program2Data)
    });

    console.log('✅ Created program 1:', program1.program.name);
    console.log('✅ Created program 2:', program2.program.name);

    // Step 2: Create episodes
    console.log('\n📝 Step 2: Creating episodes...');

    const episode1Data = {
      title: 'Introduction to Clean Architecture',
      description: 'Learn the basics of clean architecture',
      slug: 'intro-clean-architecture',
      program_id: program1.program.id,
      kind: 'video',
      language: 'en',
      duration: 3600,
      tags: ['clean-architecture', 'basics'],
      transcripts: [
        {
          content: 'Welcome to clean architecture...',
          language: 'en',
          format: 'vtt'
        }
      ]
    };

    const episode2Data = {
      title: 'SOLID Principles',
      description: 'Understanding SOLID principles',
      slug: 'solid-principles',
      program_id: program1.program.id,
      kind: 'audio',
      language: 'en',
      duration: 2400,
      tags: ['solid', 'principles']
    };

    const episode1 = await httpRequest(`${BASE_URL}/cms/episodes`, {
      method: 'POST',
      body: JSON.stringify(episode1Data)
    });

    const episode2 = await httpRequest(`${BASE_URL}/cms/episodes`, {
      method: 'POST',
      body: JSON.stringify(episode2Data)
    });

    console.log('✅ Created episode 1:', episode1.episode.title);
    console.log('✅ Created episode 2:', episode2.episode.title);

    // Step 3: Update episode
    console.log('\n✏️ Step 3: Updating episode...');

    const updateData = {
      title: 'Updated: Introduction to Clean Architecture',
      description: 'Updated description with more details',
      duration: 4200,
      tags: ['clean-architecture', 'basics', 'updated'],
      transcripts: [
        {
          content: 'Welcome to clean architecture... (updated)',
          language: 'en',
          format: 'vtt'
        },
        {
          content: 'Welcome to clean architecture... (Arabic)',
          language: 'en',
          format: 'vtt'
        }
      ]
    };

    const updatedEpisode = await httpRequest(`${BASE_URL}/cms/episodes/${episode1.episode.id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    console.log('✅ Updated episode:', updatedEpisode.episode.title);
    console.log('   New duration:', updatedEpisode.episode.duration);
    console.log('   Transcripts count:', updatedEpisode.episode.transcripts.length);

    // Step 4: Change episode status
    console.log('\n🔄 Step 4: Changing episode status...');

    const statusChangeData = {
      status: 'published'
    };

    const publishedEpisode = await httpRequest(`${BASE_URL}/cms/episodes/${episode1.episode.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusChangeData)
    });

    console.log('✅ Changed status to:', publishedEpisode.episode.status);
    console.log('   Published at:', publishedEpisode.episode.published_at);

    // Step 5: List episodes with filters
    console.log('\n📋 Step 5: Listing episodes with filters...');

    // List all episodes in program 1
    const allEpisodesInProgram1 = await httpRequest(
      `${BASE_URL}/cms/episodes?program_id=${program1.program.id}&page=1&limit=10`
    );

    console.log('✅ Episodes in program 1:', allEpisodesInProgram1.pagination.total);

    // List only video episodes
    const videoEpisodes = await httpRequest(
      `${BASE_URL}/cms/episodes?program_id=${program1.program.id}&kind=video&page=1&limit=10`
    );

    console.log('✅ Video episodes:', videoEpisodes.pagination.total);

    // List only published episodes
    const publishedEpisodes = await httpRequest(
      `${BASE_URL}/cms/episodes?program_id=${program1.program.id}&status=published&page=1&limit=10`
    );

    console.log('✅ Published episodes:', publishedEpisodes.pagination.total);

    // Search episodes
    const searchResults = await httpRequest(
      `${BASE_URL}/cms/episodes?search=architecture&page=1&limit=10`
    );

    console.log('✅ Search results for "architecture":', searchResults.pagination.total);

    // Step 6: Move episode to another program
    console.log('\n🚀 Step 6: Moving episode to another program...');

    const moveData = {
      program_id: program2.program.id,
      slug: 'clean-architecture-moved'
    };

    const movedEpisode = await httpRequest(`${BASE_URL}/cms/episodes/${episode1.episode.id}/move`, {
      method: 'PATCH',
      body: JSON.stringify(moveData)
    });

    console.log('✅ Moved episode to program:', movedEpisode.episode.program_id);
    console.log('   New slug:', movedEpisode.episode.slug);

    // Verify the move
    const program1EpisodesAfterMove = await httpRequest(
      `${BASE_URL}/cms/episodes?program_id=${program1.program.id}&page=1&limit=10`
    );

    const program2EpisodesAfterMove = await httpRequest(
      `${BASE_URL}/cms/episodes?program_id=${program2.program.id}&page=1&limit=10`
    );

    console.log('   Episodes remaining in program 1:', program1EpisodesAfterMove.pagination.total);
    console.log('   Episodes now in program 2:', program2EpisodesAfterMove.pagination.total);

    // Step 7: Test error cases
    console.log('\n⚠️ Step 7: Testing error cases...');

    // Try to create episode with duplicate slug in same program
    try {
      await httpRequest(`${BASE_URL}/cms/episodes`, {
        method: 'POST',
        body: JSON.stringify({
          ...episode2Data,
          title: 'Duplicate Slug Test'
        })
      });
      console.log('❌ Should have failed with duplicate slug error');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate slug');
    }

    // Try to get non-existent episode
    try {
      await httpRequest(`${BASE_URL}/cms/episodes/non-existent-id`);
      console.log('❌ Should have failed with not found error');
    } catch (error) {
      console.log('✅ Correctly returned 404 for non-existent episode');
    }

    console.log('\n🎉 All Episode API tests completed successfully!');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCompleteEpisodeApiCycle();
