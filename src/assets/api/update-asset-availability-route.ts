import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { AssetDto } from '../application/index.js';
import { UpdateAssetAvailabilityUseCase } from '../application/index.js';
import { type AssetRepository } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';

const UpdateAvailabilityParamsDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

const UpdateAvailabilityBodyDto = Type.Object({
  is_available: Type.Boolean(),
});

export function registerUpdateAssetAvailabilityRoute(app: FastifyInstance, dependencies: {
  assetRepository: AssetRepository;
}) {
  const updateAssetAvailabilityUseCase = new UpdateAssetAvailabilityUseCase(dependencies.assetRepository);

  app.patch('/assets/:id/availability', {
    schema: {
      tags: ['Assets'],
      summary: 'Update asset availability',
      description: 'Updates the availability status of a specific asset',
      params: UpdateAvailabilityParamsDto,
      body: UpdateAvailabilityBodyDto,
      response: {
        200: AssetDto,
        404: ErrorSchema,
        400: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    const { id } = req.params as any;
    const { is_available } = req.body as any;
    
    const result = await updateAssetAvailabilityUseCase.execute({ 
      assetId: id, 
      isAvailable: is_available 
    });
    return reply.code(200).send(result.asset);
  });

  console.log('Update asset availability route registered');
}
