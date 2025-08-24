import type { FastifyInstance } from 'fastify';
import { ListProgramsQuery, ListProgramsResponse } from '../application/index.js';
import { ListProgramsUseCase } from '../application/index.js';
import { type ProgramRepository } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';

export function registerListProgramsRoute(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  const listProgramsUseCase = new ListProgramsUseCase(dependencies.programRepository);

  app.get('/programs', {
    schema: {
      tags: ['Programs'],
      summary: 'List programs',
      description: 'Retrieves a paginated list of programs with optional filtering by status, type, and search term',
      querystring: ListProgramsQuery,
      response: {
        200: ListProgramsResponse,
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
        ...(query.type && { type: query.type }),
        ...(query.search && { search: query.search })
      }
    };

    const result = await listProgramsUseCase.executeForApi(input);
    return reply.code(200).send(result);
  });

  console.log('List programs route registered');
}
