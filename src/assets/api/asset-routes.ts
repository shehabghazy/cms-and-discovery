import type { FastifyInstance } from 'fastify';
import { type AssetRepository, type StorageProvider } from '../domain/index.js';
import { registerUploadAssetRoute } from './upload-asset-route.js';
import { registerGetAssetDetailsRoute } from './get-asset-details-route.js';
import { registerUpdateAssetAvailabilityRoute } from './update-asset-availability-route.js';
import { registerDownloadAssetRoute } from './download-asset-route.js';

export function registerAssetRoutes(app: FastifyInstance, dependencies: {
  assetRepository: AssetRepository;
  storageProvider: StorageProvider;
}) {
  registerUploadAssetRoute(app, dependencies);
  registerGetAssetDetailsRoute(app, dependencies);
  registerUpdateAssetAvailabilityRoute(app, dependencies);
  registerDownloadAssetRoute(app, dependencies);
  
  console.log('All asset routes registered');
}
