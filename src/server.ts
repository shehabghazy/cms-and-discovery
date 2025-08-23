import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type, Static } from '@sinclair/typebox';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { registerErrorHandler } from './shared/api/error-handler.js';
import { registerCMSRoutes } from './cms/api/index.js';
import { registerAssetRoutes } from './assets/api/asset-routes.js';
import { InMemoryProgramRepository, InMemoryEpisodeRepository } from './cms/infrastructure/index.js';
import { InMemoryAssetRepository, LocalFileStorageProvider } from './assets/infrastructure/index.js';

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

// --- Global error handler (must be registered early)
registerErrorHandler(app);

// --- CORS support for Swagger UI
await app.register(cors, {
  origin: true, // Allow all origins for development
  credentials: true
});

// --- Multipart support for file uploads
await app.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1 // Single file upload
  }
});

// --- Swagger documentation
await app.register(swagger, {
  swagger: {
    info: {
      title: 'Thmanyah CMS API',
      description: 'Content Management System API for Programs, Episodes, and Assets',
      version: '1.0.0'
    },
    host: `localhost:${PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'General', description: 'General API endpoints' },
      { name: 'Programs', description: 'Program management endpoints' },
      { name: 'Episodes', description: 'Episode management endpoints' },
      { name: 'Assets', description: 'Asset management endpoints' }
    ]
  }
});

await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true
});

// --- Welcome route (TypeBox schema)
const WelcomeSchema = Type.Object({
  message: Type.String(),
  timestamp: Type.String(),
  version: Type.String(),
});
type WelcomeResponse = Static<typeof WelcomeSchema>;

app.get('/', {
  schema: { 
    tags: ['General'],
    summary: 'API Welcome',
    description: 'Returns welcome message with API information',
    response: { 200: WelcomeSchema } 
  },
}, async (): Promise<WelcomeResponse> => ({
  message: 'Welcome to Thmanyah API!',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
}));


const programRepository = new InMemoryProgramRepository();
const episodeRepository = new InMemoryEpisodeRepository();
const assetRepository = new InMemoryAssetRepository();
const storageProvider = new LocalFileStorageProvider();

// --- Feature routes
await registerCMSRoutes(app, { programRepository, episodeRepository });
await registerAssetRoutes(app, { assetRepository, storageProvider });


// --- Graceful shutdown
process.on('SIGINT', async () => {
  app.log.info('Received SIGINT, shutting down gracefully...');
  await app.close();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  app.log.info('Received SIGTERM, shutting down gracefully...');
  await app.close();
  process.exit(0);
});

// --- Start
try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
