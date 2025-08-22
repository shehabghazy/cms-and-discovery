// api/program.routes.ts
import type { FastifyInstance } from 'fastify';
import { 
  ProgramCreateDto, 
  ProgramDto, 
  CreateProgramUseCase,
  ConflictError 
} from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/adapters/http/error-schema.js';

export function registerProgramRoutes(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  // Create use case with injected repository
  const createProgramUseCase = new CreateProgramUseCase(dependencies.programRepository);

  // POST /programs - Create a new program
  app.post('/programs', {
    schema: {
      body: ProgramCreateDto,
      response: {
        201: ProgramDto,
        400: ErrorSchema,
        409: ErrorSchema,
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
