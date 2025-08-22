import { Program } from '../program.js';

/**
 * Repository interface for Program domain entity
 * This is a port (interface) that defines the contract for data persistence
 * Implementations will be provided in the infrastructure layer
 */
export interface ProgramRepository {
  /**
   * Save a program entity to the data store
   * @param program - The program entity to save
   * @returns Promise that resolves when the program is saved
   */
  save(program: Program): Promise<void>;

  /**
   * Find a program by its unique identifier
   * @param id - The program ID
   * @returns Promise that resolves to the program or null if not found
   */
  findById(id: string): Promise<Program | null>;

  /**
   * Find a program by its slug
   * @param slug - The program slug
   * @returns Promise that resolves to the program or null if not found
   */
  findBySlug(slug: string): Promise<Program | null>;

  /**
   * Find multiple programs with optional filtering and pagination
   * @param options - Query options for filtering and pagination
   * @returns Promise that resolves to paginated results
   */
  findMany(options?: {
    page?: number;
    limit?: number;
    filters?: { type?: string; status?: string };
  }): Promise<{ programs: Program[]; total: number }>;

  /**
   * Delete a program by its ID
   * @param id - The program ID to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a program exists with the given slug
   * @param slug - The slug to check
   * @param excludeId - Optional ID to exclude from the check
   * @returns Promise that resolves to true if exists, false otherwise
   */
  existsBySlug(slug: string, excludeId?: string): Promise<boolean>;
}
