import type { FastifyInstance } from 'fastify';
import { ProgramUpdateDto, ProgramDto } from '../application/index.js';
import { UpdateProgramUseCase } from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';
import { Type } from '@sinclair/typebox';

export function registerUpdateProgramRoute(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  const updateProgramUseCase = new UpdateProgramUseCase(dependencies.programRepository);

  app.patch('/programs/:id', {
    schema: {
      tags: ['Programs'],
      summary: 'Update a program',
      description: 'Updates an existing program with the provided details',
      params: Type.Object({
        id: Type.String()
      }),
      body: ProgramUpdateDto,
      response: {
        200: ProgramDto,
        400: ErrorSchema,
        404: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await updateProgramUseCase.execute({ 
      programId: (req.params as any).id,
      updateData: req.body as any
    });
    return reply.code(200).send(result.program);
  });

  console.log('Update program route registered');
}
