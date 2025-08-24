import type { FastifyInstance } from 'fastify';
import { EpisodeMoveToProgram, EpisodeDto } from '../application/index.js';
import { MoveEpisodeToProgramUseCase } from '../application/index.js';
import { type EpisodeRepository, type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';
import { Type } from '@sinclair/typebox';

export function registerMoveEpisodeToProgramRoute(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
  programRepository: ProgramRepository;
}) {
  const moveEpisodeUseCase = new MoveEpisodeToProgramUseCase(
    dependencies.episodeRepository,
    dependencies.programRepository
  );

  app.put('/episodes/:id/move', {
    schema: {
      tags: ['Episodes'],
      summary: 'Move episode to another program',
      description: 'Moves an episode to a different program with a new slug',
      params: Type.Object({
        id: Type.String()
      }),
      body: EpisodeMoveToProgram,
      response: {
        200: EpisodeDto,
        400: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await moveEpisodeUseCase.execute({ 
      episodeId: (req.params as any).id,
      moveData: req.body as any
    });
    return reply.code(200).send(result.episode);
  });

  console.log('Move episode to program route registered');
}
