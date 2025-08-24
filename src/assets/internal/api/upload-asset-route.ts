import type { FastifyInstance } from 'fastify';
import { AssetDto } from '../application/index.js';
import { UploadAssetUseCase } from '../application/index.js';
import { type AssetRepository, type StorageProvider, type FileInfo } from '../domain/index.js';
import { ErrorSchema } from '../../../shared/api/error-schema.js';
import * as path from 'path';

export function registerUploadAssetRoute(app: FastifyInstance, dependencies: {
  assetRepository: AssetRepository;
  storageProvider: StorageProvider;
}) {
  const uploadAssetUseCase = new UploadAssetUseCase(
    dependencies.assetRepository,
    dependencies.storageProvider
  );

  app.post('/assets', {
    schema: {
      tags: ['Assets'],
      summary: 'Upload a new asset',
      description: 'Uploads a new asset file and creates an asset record',
      consumes: ['multipart/form-data'],
    //   body: {
    //     type: 'object',
    //     properties: {
    //       file: {
    //         type: 'string',
    //         format: 'binary',
    //         description: 'The file to upload'
    //       }
    //     },
    //     required: ['file']
    //   },
      response: {
        201: AssetDto,
        400: ErrorSchema,
        422: ErrorSchema,
      },
    },
  }, async (req, reply) => {
    // Handle multipart file upload
    const data = await req.file();
    
    if (!data) {
      return reply.code(400).send({
        error: 'BadRequest',
        message: 'No file provided'
      });
    }

    // Extract file information from uploaded file
    const buffer = await data.toBuffer();
    const originalFilename = data.filename;
    
    if (!originalFilename) {
      return reply.code(400).send({
        error: 'BadRequest',
        message: 'File must have a filename'
      });
    }

    // Extract extension from filename
    const extension = path.extname(originalFilename).slice(1).toLowerCase();
    
    if (!extension) {
      return reply.code(400).send({
        error: 'BadRequest',
        message: 'File must have a valid extension'
      });
    }

    const fileInfo: FileInfo = {
      name: originalFilename,
      extension,
      size: buffer.length,
      buffer,
      mimeType: data.mimetype || 'application/octet-stream'
    };

    const result = await uploadAssetUseCase.execute({ fileInfo });
    return reply.code(201).send(result.asset);
  });

  console.log('Upload asset route registered');
}
