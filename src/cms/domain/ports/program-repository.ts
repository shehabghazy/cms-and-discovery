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

}
