import type { FastifyInstance } from 'fastify';
import { 
  ProgramCreateDto, 
  ProgramDto, 
  CreateProgramUseCase 
} from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';


export function registerCreateProgramRoute(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  const createProgramUseCase = new CreateProgramUseCase(dependencies.programRepository);

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
      programData: req.body as any
    });
    return reply.code(201).send(result.programData);
  });

  app.log.info('Program routes registered');
}
