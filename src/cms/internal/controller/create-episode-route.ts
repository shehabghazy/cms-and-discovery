import type { FastifyInstance } from 'fastify';
import { EpisodeCreateDto, EpisodeDto } from '../application/index.js';
import { CreateEpisodeUseCase } from '../application/index.js';
import { type EpisodeRepository, type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';


export function registerCreateEpisodeRoute(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
  programRepository: ProgramRepository;
}) {
  const createEpisodeUseCase = new CreateEpisodeUseCase(
    dependencies.episodeRepository,
    dependencies.programRepository
  );

  app.post('/episodes', {
    schema: {
      tags: ['Episodes'],
      summary: 'Create a new episode',
      description: 'Creates a new episode with the provided details',
      body: EpisodeCreateDto,
      response: {
        201: EpisodeDto,
        400: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const result = await createEpisodeUseCase.execute({ 
      episodeData: req.body as any
    });
    return reply.code(201).send(result.episode);
  });

  console.log('Create episode route registered');
}
