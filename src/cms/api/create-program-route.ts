import type { FastifyInstance } from 'fastify';
import { ProgramCreateDto, ProgramDto } from '../application/index.js';
import { CreateProgramUseCase } from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';


export function registerCreateProgramRoute(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  const createProgramUseCase = new CreateProgramUseCase(dependencies.programRepository);

  app.post('/programs', {
    schema: {
      tags: ['Programs'],
      summary: 'Create a new program',
      description: 'Creates a new program with the provided details',
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
    return reply.code(201).send(result.program);
  });

  console.log('Create program route registered');
}
