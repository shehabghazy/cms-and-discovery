// infrastructure/repositories/InMemoryEpisodeRepository.ts
import { Episode, type EpisodeRepository } from '../../domain/index.js';
import { ConflictError } from '../../application/index.js';
import { ListEpisodesFilters } from '../../domain/models/list-episodes-input.js';
import { PaginationOptions } from '../../../../shared/application/pagination-query/query-list.js';

/**
 * In-memory repository implementation for development/testing
 * In production, this would be replaced with a database implementation
 */
export class InMemoryEpisodeRepository implements EpisodeRepository {
  private readonly episodes = new Map<string, Episode>();
  private readonly slugIndex = new Map<string, string>(); // programId:slug -> id mapping for O(1) lookups
  private readonly programIndex = new Map<string, Set<string>>(); // programId -> Set<episodeId> mapping

  async save(episode: Episode): Promise<void> {
    // Check if this is an update to an existing episode
    const existingEpisode = this.episodes.get(episode.id);
    
    if (existingEpisode) {
      // Clean up old indexes if program_id or slug changed
      if (existingEpisode.program_id !== episode.program_id || existingEpisode.slug !== episode.slug) {
        // Remove from old slug index
        const oldSlugKey = `${existingEpisode.program_id}:${existingEpisode.slug}`;
        this.slugIndex.delete(oldSlugKey);
        
        // Remove from old program index
        const oldProgramEpisodes = this.programIndex.get(existingEpisode.program_id);
        if (oldProgramEpisodes) {
          oldProgramEpisodes.delete(episode.id);
          if (oldProgramEpisodes.size === 0) {
            this.programIndex.delete(existingEpisode.program_id);
          }
        }
      }
    }
    
    // Update all indexes atomically
    this.episodes.set(episode.id, episode);
    
    const slugKey = `${episode.program_id}:${episode.slug}`;
    this.slugIndex.set(slugKey, episode.id);
    
    // Update program index
    if (!this.programIndex.has(episode.program_id)) {
      this.programIndex.set(episode.program_id, new Set());
    }
    this.programIndex.get(episode.program_id)!.add(episode.id);
  }

  async findById(id: string): Promise<Episode | null> {
    return this.episodes.get(id) || null;
  }

  async findBySlugInProgram(programId: string, slug: string): Promise<Episode | null> {
    const slugKey = `${programId}:${slug}`;
    const id = this.slugIndex.get(slugKey);
    if (!id) return null;
    
    const episode = this.episodes.get(id);
    if (!episode) return null;
    
    // Verify the episode actually belongs to the requested program
    // This handles cases where the index might be stale
    if (episode.program_id !== programId || episode.slug !== slug) {
      // Clean up stale index entry
      this.slugIndex.delete(slugKey);
      return null;
    }
    
    return episode;
  }

  async findByProgramId(programId: string, options?: {
    pagination?: PaginationOptions;
    filters?: Omit<ListEpisodesFilters, 'program_id'>;
  }): Promise<{ data: Episode[]; total: number }> {
    const episodeIds = this.programIndex.get(programId) || new Set();
    let episodes = Array.from(episodeIds)
      .map(id => this.episodes.get(id))
      .filter((episode): episode is Episode => episode !== undefined);
    
    // Apply filters (excluding program_id since we already filtered by it)
    episodes = this.applyFilters(episodes, options?.filters);
    
    const total = episodes.length;
    
    // Apply pagination
    episodes = this.applyPagination(episodes, options?.pagination);
    
    return { data: episodes, total };
  }

  async findMany(options?: {
    pagination?: PaginationOptions;
    filters?: ListEpisodesFilters;
  }): Promise<{ data: Episode[]; total: number }> {
    let episodes = Array.from(this.episodes.values());
    
    // Apply filters
    episodes = this.applyFilters(episodes, options?.filters);
    
    const total = episodes.length;
    
    // Apply pagination
    episodes = this.applyPagination(episodes, options?.pagination);
    
    return { data: episodes, total };
  }

  async delete(id: string): Promise<boolean> {
    const episode = this.episodes.get(id);
    if (episode) {
      // Remove from all indexes atomically
      this.episodes.delete(id);
      
      const slugKey = `${episode.program_id}:${episode.slug}`;
      this.slugIndex.delete(slugKey);
      
      const programEpisodes = this.programIndex.get(episode.program_id);
      if (programEpisodes) {
        programEpisodes.delete(id);
        if (programEpisodes.size === 0) {
          this.programIndex.delete(episode.program_id);
        }
      }
      
      return true;
    }
    return false;
  }

  async existsBySlugInProgram(programId: string, slug: string, excludeId?: string): Promise<boolean> {
    const slugKey = `${programId}:${slug}`;
    const existingId = this.slugIndex.get(slugKey);
    if (!existingId || existingId === excludeId) return false;
    
    const episode = this.episodes.get(existingId);
    if (!episode) {
      // Clean up stale index entry
      this.slugIndex.delete(slugKey);
      return false;
    }
    
    // Verify the episode actually belongs to the requested program
    if (episode.program_id !== programId || episode.slug !== slug) {
      // Clean up stale index entry
      this.slugIndex.delete(slugKey);
      return false;
    }
    
    return true;
  }

  async countByProgramId(programId: string, filters?: Omit<ListEpisodesFilters, 'program_id'>): Promise<number> {
    const episodeIds = this.programIndex.get(programId) || new Set();
    let episodes = Array.from(episodeIds)
      .map(id => this.episodes.get(id))
      .filter((episode): episode is Episode => episode !== undefined);
    
    // Apply filters (excluding program_id since we already filtered by it)
    episodes = this.applyFilters(episodes, filters);
    
    return episodes.length;
  }

  private applyFilters(episodes: Episode[], filters?: Partial<ListEpisodesFilters>): Episode[] {
    if (!filters) return episodes;
    
    if (filters.status) {
      episodes = episodes.filter(e => e.status === filters.status);
    }
    if (filters.kind) {
      episodes = episodes.filter(e => e.kind === filters.kind);
    }
    if (filters.program_id) {
      episodes = episodes.filter(e => e.program_id === filters.program_id);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      episodes = episodes.filter(e => 
        e.title.toLowerCase().includes(searchTerm) ||
        e.slug.toLowerCase().includes(searchTerm) ||
        (e.description && e.description.toLowerCase().includes(searchTerm))
      );
    }
    
    return episodes;
  }

  private applyPagination(episodes: Episode[], pagination?: PaginationOptions): Episode[] {
    if (!pagination) return episodes;
    
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return episodes.slice(startIndex, endIndex);
  }
}
