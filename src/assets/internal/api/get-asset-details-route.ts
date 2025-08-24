import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { AssetDto } from '../application/index.js';
import { GetAssetDetailsUseCase } from '../application/index.js';
import { type AssetRepository } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';

const GetAssetParamsDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export function registerGetAssetDetailsRoute(app: FastifyInstance, dependencies: {
  assetRepository: AssetRepository;
}) {
  const getAssetDetailsUseCase = new GetAssetDetailsUseCase(dependencies.assetRepository);

  app.get('/assets/:id', {
    schema: {
      tags: ['Assets'],
      summary: 'Get asset details',
      description: 'Retrieves the details of a specific asset by ID',
      params: GetAssetParamsDto,
      response: {
        200: AssetDto,
        404: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const { id } = req.params as any;
    
    const result = await getAssetDetailsUseCase.execute({ assetId: id });
    return reply.code(200).send(result.asset);
  });

  console.log('Get asset details route registered');
}
