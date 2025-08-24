import type { FastifyInstance } from 'fastify';
import { EpisodeUpdateDto, EpisodeDto } from '../application/index.js';
import { UpdateEpisodeUseCase } from '../application/index.js';
import { type EpisodeRepository } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';
import { Type } from '@sinclair/typebox';

export function registerUpdateEpisodeRoute(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
}) {
  const updateEpisodeUseCase = new UpdateEpisodeUseCase(dependencies.episodeRepository);

  app.patch('/episodes/:id', {
    schema: {
      tags: ['Episodes'],
      summary: 'Update an episode',
      description: 'Updates an existing episode with the provided details',
      params: Type.Object({
        id: Type.String()
      }),
      body: EpisodeUpdateDto,
      response: {
        200: EpisodeDto,
        400: ErrorSchema,
        404: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await updateEpisodeUseCase.execute({ 
      episodeId: (req.params as any).id,
      updateData: req.body as any
    });
    return reply.code(200).send(result.episode);
  });

  console.log('Update episode route registered');
}
