import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { DownloadAssetUseCase } from '../application/index.js';
import { type AssetRepository, type StorageProvider } from '../domain/index.js';
import { ErrorSchema } from '../../shared/api/error-schema.js';

const DownloadAssetParamsDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export function registerDownloadAssetRoute(app: FastifyInstance, dependencies: {
  assetRepository: AssetRepository;
  storageProvider: StorageProvider;
}) {
  const downloadAssetUseCase = new DownloadAssetUseCase(
    dependencies.assetRepository,
    dependencies.storageProvider
  );

  app.get('/assets/:id/download', {
    schema: {
      tags: ['Assets'],
      summary: 'Download asset file',
      description: 'Downloads the actual file content of a specific asset',
      params: DownloadAssetParamsDto,
      response: {
        200: {
          type: 'string',
          format: 'binary',
          description: 'File content'
        },
        404: ErrorSchema,
        410: ErrorSchema, // Gone - asset not available
        423: ErrorSchema, // Locked - asset not available
      },
    },
  }, async (req, reply) => {
    const { id } = req.params as any;
    
    const result = await downloadAssetUseCase.execute({ assetId: id });
    
    // Set appropriate headers for file download
    reply.header('Content-Type', result.mimeType);
    reply.header('Content-Length', result.size.toString());
    reply.header('Content-Disposition', `attachment; filename="${result.fileName}"`);
    
    return reply.code(200).send(result.fileBuffer);
  });

  console.log('Download asset route registered');
}
