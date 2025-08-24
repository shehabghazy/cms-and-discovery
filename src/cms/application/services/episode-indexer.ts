import { SearchEngine } from '../../../shared/domain/ports/search-engine/search-engine-port.js';

// Interface for indexable episode data
export interface IndexableEpisodeData {
  id: string;
  program_id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: string;
  published_at: Date | null;
}

export class EpisodeIndexer {
  constructor(private readonly engine: SearchEngine) {}

  async index(episodeData: IndexableEpisodeData): Promise<void> {
    console.log(`🔍 EpisodeIndexer indexing episode: ${episodeData.id} (${episodeData.title})`);
    
    const doc = {
      id: episodeData.id,
      program_id: episodeData.program_id,
      slug: episodeData.slug,
      title: episodeData.title,
      description: episodeData.description,
      kind: episodeData.kind,
      published_at: episodeData.published_at?.toISOString() || null,
    };
    
    console.log(`📄 Document to index:`, doc);
    
    // Index is already bootstrapped during SearchEngine initialization
    await this.engine.index('episodes', doc);
    
    console.log(`✅ Episode ${episodeData.id} successfully indexed in 'episodes' index`);
  }

  async remove(episodeId: string): Promise<void> {
    console.log(`🗑️ EpisodeIndexer removing episode: ${episodeId} from search index`);
    await this.engine.delete('episodes', [episodeId]);
    console.log(`✅ Episode ${episodeId} successfully removed from 'episodes' index`);
  }
}
