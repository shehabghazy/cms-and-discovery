// infrastructure/repositories/InMemoryProgramRepository.ts
import { Program, type ProgramRepository } from '../../domain/index.js';
import { ConflictError } from '../../application/index.js';

/**
 * In-memory repository implementation for development/testing
 * In production, this would be replaced with a database implementation
 */
export class InMemoryProgramRepository implements ProgramRepository {
  private programs = new Map<string, Program>();

  async save(program: Program): Promise<void> {
    // Check for slug conflicts
    const existing = await this.findBySlug(program.slug);
    if (existing && existing.id !== program.id) {
      throw new ConflictError(`Program with slug '${program.slug}' already exists`);
    }
    this.programs.set(program.id, program);
  }

  async findById(id: string): Promise<Program | null> {
    return this.programs.get(id) || null;
  }

  async findBySlug(slug: string): Promise<Program | null> {
    for (const program of this.programs.values()) {
      if (program.slug === slug) return program;
    }
    return null;
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
    return this.programs.delete(id);
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    for (const [id, program] of this.programs.entries()) {
      if (program.slug === slug && id !== excludeId) return true;
    }
    return false;
  }
}
