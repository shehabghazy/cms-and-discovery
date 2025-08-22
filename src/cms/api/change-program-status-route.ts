import type { FastifyInstance } from 'fastify';
import { ProgramChangeStatusDto, ProgramDto } from '../application/index.js';
import { ChangeProgramStatusUseCase } from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';
import { Type } from '@sinclair/typebox';


export function registerChangeProgramStatusRoute(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  const changeProgramStatusUseCase = new ChangeProgramStatusUseCase(dependencies.programRepository);

  app.patch('/programs/:id/status', {
    schema: {
      tags: ['Programs'],
      summary: 'Change program status',
      description: 'Changes the status of an existing program (draft → published → archived)',
      params: Type.Object({
        id: Type.String()
      }),
      body: ProgramChangeStatusDto,
      response: {
        200: ProgramDto,
        400: ErrorSchema,
        404: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await changeProgramStatusUseCase.execute({ 
      programId: (req.params as any).id,
      statusData: req.body as any
    });
    return reply.code(200).send(result.program);
  });

  console.log('Change program status route registered');
}
