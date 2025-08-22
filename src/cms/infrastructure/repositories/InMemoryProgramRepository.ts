// infrastructure/repositories/InMemoryProgramRepository.ts
import { Program, type ProgramRepository } from '../../domain/index.js';
import { ConflictError } from '../../application/index.js';

/**
 * In-memory repository implementation for development/testing
 * In production, this would be replaced with a database implementation
 */
export class InMemoryProgramRepository implements ProgramRepository {
  private readonly programs = new Map<string, Program>();
  private readonly slugIndex = new Map<string, string>(); // slug -> id mapping for O(1) lookups

  async save(program: Program): Promise<void> {
    // Check for slug conflicts with atomic operation
    const existingIdForSlug = this.slugIndex.get(program.slug);
    if (existingIdForSlug && existingIdForSlug !== program.id) {
      throw new ConflictError(`Program with slug '${program.slug}' already exists`);
    }

    // Update both maps atomically
    this.programs.set(program.id, program);
    this.slugIndex.set(program.slug, program.id);
  }

  async findById(id: string): Promise<Program | null> {
    return this.programs.get(id) || null;
  }

  async findBySlug(slug: string): Promise<Program | null> {
    const id = this.slugIndex.get(slug);
    return id ? this.programs.get(id) || null : null;
  }

  async findMany(options?: {
    page?: number;
    limit?: number;
    filters?: { type?: string; status?: string };
  }): Promise<{ programs: Program[]; total: number }> {
    let programs = Array.from(this.programs.values());
    
    // Apply filters
    if (options?.filters?.type) {
      programs = programs.filter(p => p.type === options.filters!.type);
    }
    if (options?.filters?.status) {
      programs = programs.filter(p => p.status === options.filters!.status);
    }
    
    const total = programs.length;
    
    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    programs = programs.slice(startIndex, endIndex);
    
    return { programs, total };
  }

  async delete(id: string): Promise<boolean> {
    const program = this.programs.get(id);
    if (program) {
      // Remove from both maps atomically
      this.programs.delete(id);
      this.slugIndex.delete(program.slug);
      return true;
    }
    return false;
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const existingId = this.slugIndex.get(slug);
    return existingId !== undefined && existingId !== excludeId;
  }
}
