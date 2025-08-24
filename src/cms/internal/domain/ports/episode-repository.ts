import { Episode } from '../episode.js';
import { ListEpisodesFilters } from '../models/list-episodes-input.js';
import { QueryableRepository, PaginationOptions } from '../../../../shared/application/pagination-query/query-list.js';

/**
 * Repository interface for Episode domain entity
 * This is a port (interface) that defines the contract for data persistence
 * Implementations will be provided in the infrastructure layer
 */
export interface EpisodeRepository extends QueryableRepository<Episode, ListEpisodesFilters> {
  /**
   * Save an episode entity to the data store
   * @param episode - The episode entity to save
   * @returns Promise that resolves when the episode is saved
   */
  save(episode: Episode): Promise<void>;

  /**
   * Find an episode by its unique identifier
   * @param id - The episode ID
   * @returns Promise that resolves to the episode or null if not found
   */
  findById(id: string): Promise<Episode | null>;

  /**
   * Find an episode by its slug within a specific program
   * @param programId - The program ID
   * @param slug - The episode slug
   * @returns Promise that resolves to the episode or null if not found
   */
  findBySlugInProgram(programId: string, slug: string): Promise<Episode | null>;

  /**
   * Find all episodes for a specific program
   * @param programId - The program ID
   * @param options - Query options for filtering and pagination
   * @returns Promise that resolves to paginated results
   */
  findByProgramId(programId: string, options?: {
    pagination?: PaginationOptions;
    filters?: Omit<ListEpisodesFilters, 'program_id'>;
  }): Promise<{ data: Episode[]; total: number }>;

  /**
   * Find multiple episodes with optional filtering and pagination
   * @param options - Query options for filtering and pagination
   * @returns Promise that resolves to paginated results
   */
  findMany(options?: {
    pagination?: PaginationOptions;
    filters?: ListEpisodesFilters;
  }): Promise<{ data: Episode[]; total: number }>;

  /**
   * Delete an episode by its ID
   * @param id - The episode ID to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if an episode exists with the given slug within a specific program
   * @param programId - The program ID
   * @param slug - The slug to check
   * @param excludeId - Optional ID to exclude from the check
   * @returns Promise that resolves to true if exists, false otherwise
   */
  existsBySlugInProgram(programId: string, slug: string, excludeId?: string): Promise<boolean>;

  /**
   * Count total episodes for a specific program
   * @param programId - The program ID
   * @param filters - Optional filters to apply
   * @returns Promise that resolves to the count
   */
  countByProgramId(programId: string, filters?: Omit<ListEpisodesFilters, 'program_id'>): Promise<number>;
}
