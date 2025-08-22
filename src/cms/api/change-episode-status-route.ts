import type { FastifyInstance } from 'fastify';
import { EpisodeChangeStatusDto, EpisodeDto } from '../application/index.js';
import { ChangeEpisodeStatusUseCase } from '../application/index.js';
import { type EpisodeRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';
import { Type } from '@sinclair/typebox';

export function registerChangeEpisodeStatusRoute(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
}) {
  const changeEpisodeStatusUseCase = new ChangeEpisodeStatusUseCase(dependencies.episodeRepository);

  app.put('/episodes/:id/status', {
    schema: {
      tags: ['Episodes'],
      summary: 'Change episode status',
      description: 'Changes the status of an existing episode (publish or hide)',
      params: Type.Object({
        id: Type.String()
      }),
      body: EpisodeChangeStatusDto,
      response: {
        200: EpisodeDto,
        400: ErrorSchema,
        404: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await changeEpisodeStatusUseCase.execute({ 
      episodeId: (req.params as any).id,
      statusData: req.body as any
    });
    return reply.code(200).send(result.episode);
  });

  console.log('Change episode status route registered');
}
