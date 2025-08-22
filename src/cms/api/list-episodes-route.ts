import type { FastifyInstance } from 'fastify';
import { ListEpisodesQuery, ListEpisodesResponse } from '../application/index.js';
import { ListEpisodesUseCase } from '../application/index.js';
import { type EpisodeRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';

export function registerListEpisodesRoute(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
}) {
  const listEpisodesUseCase = new ListEpisodesUseCase(dependencies.episodeRepository);

  app.get('/episodes', {
    schema: {
      tags: ['Episodes'],
      summary: 'List episodes',
      description: 'Retrieves a paginated list of episodes with optional filtering by status, kind, program, and search term',
      querystring: ListEpisodesQuery,
      response: {
        200: ListEpisodesResponse,
        400: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const query = req.query as any;
    
    // Transform query parameters to use case input
    const input = {
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10
      },
      filters: {
        ...(query.status && { status: query.status }),
        ...(query.kind && { kind: query.kind }),
        ...(query.program_id && { program_id: query.program_id }),
        ...(query.search && { search: query.search })
      }
    };

    const result = await listEpisodesUseCase.executeForApi(input);
    return reply.code(200).send(result);
  });

  console.log('List episodes route registered');
}
