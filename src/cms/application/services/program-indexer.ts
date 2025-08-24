import { SearchEngine } from '../../../shared/domain/ports/search-engine/search-engine.port.js';
import { Program } from '../../domain/program.js';

// Interface for indexable program data
export interface IndexableProgramData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  language: string;
  published_at: Date | null;
}

export class ProgramIndexer {
  constructor(private readonly engine: SearchEngine) {}

  async index(programData: IndexableProgramData): Promise<void> {
    console.log(`🔍 ProgramIndexer indexing program: ${programData.id} (${programData.title})`);
    
    const doc = {
      id: programData.id,
      slug: programData.slug,
      title: programData.title,
      description: programData.description,
      type: programData.type,
      language: programData.language,
      published_at: programData.published_at?.toISOString() || null,
    };
    
    console.log(`📄 Document to index:`, doc);
    
    // Ensure index exists before indexing
    await this.engine.ensureIndex('programs');
    await this.engine.index('programs', doc);
    
    console.log(`✅ Program ${programData.id} successfully indexed in 'programs' index`);
  }

  async remove(programId: string): Promise<void> {
    await this.engine.delete('programs', [programId]);
  }
}
