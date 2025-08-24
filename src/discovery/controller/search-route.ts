import type { FastifyInstance } from 'fastify';
import { SearchCatalogUseCase } from '../application/usecases/search-catalog.js';
import { SearchQueryParams, SearchResponse } from '../application/contracts/search-catalog-contract.js';
import { SearchEngine } from '../../shared/domain/ports/search-engine/search-engine-port.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';

export function registerSearchRoute(app: FastifyInstance, dependencies: {
  searchEngine: SearchEngine;
}) {
  const searchCatalogUseCase = new SearchCatalogUseCase(dependencies.searchEngine);

  app.get('/search', {
    schema: {
      tags: ['Discovery'],
      summary: 'Search programs and episodes',
      description: 'Search through the public catalog of programs and episodes',
      querystring: SearchQueryParams,
      response: {
        200: SearchResponse,
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const query = req.query as any;
    
    // Transform query parameters to use case input
    const input = {
      query: query.q,
      filters: {
        type: query.type
      },
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20
      }
    };

    const result = await searchCatalogUseCase.execute(input);
    return reply.code(200).send(result);
  });

  console.log('Search route registered');
}
