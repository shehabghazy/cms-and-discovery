// adapters/http/program.routes.ts
import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { 
  ProgramCreateDto, 
  ProgramDto,
  CreateProgramUseCase,
  ConflictError 
} from '../../../cms/application/index.js';
import { type ProgramRepository } from '../../../cms/domain/index.js';

// Mock repository for now - will be replaced with real implementation
class MockProgramRepository implements ProgramRepository {
  private programs = new Map();

  async save(program: any): Promise<void> {
    // Check for slug conflicts
    const existing = await this.findBySlug(program.slug);
    if (existing && existing.id !== program.id) {
      throw new ConflictError(`Program with slug '${program.slug}' already exists`);
    }
    this.programs.set(program.id, program);
  }

  async findById(id: string): Promise<any> {
    return this.programs.get(id) || null;
  }

  async findBySlug(slug: string): Promise<any> {
    for (const program of this.programs.values()) {
      if (program.slug === slug) return program;
    }
    return null;
  }

  async findMany(options?: any): Promise<{ programs: any[]; total: number }> {
    const programs = Array.from(this.programs.values());
    return { programs, total: programs.length };
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

export async function registerProgramRoutes(app: FastifyInstance) {
  // Create use case with mock repository
  const programRepository = new MockProgramRepository();
  const createProgramUseCase = new CreateProgramUseCase(programRepository);

  // POST /programs - Create a new program
  app.post('/programs', {
    schema: {
      body: ProgramCreateDto,
      response: { 
        201: ProgramDto,
        400: Type.Object({ 
          error: Type.String(), 
          details: Type.Optional(Type.Array(Type.String())) 
        }),
        409: Type.Object({ error: Type.String() })
      },
    },
  }, async (req, reply) => {
    const result = await createProgramUseCase.execute({ 
      programData: req.body as any // TypeBox validates this at runtime
    });
    return reply.code(201).send(result.programData);
  });

  app.log.info('Program routes registered');
}
