import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type, Static } from '@sinclair/typebox';

import { registerErrorHandler } from './shared/api/error-handler.js';
import { registerCreateProgramRoute } from './cms/api/create-program-route.js';
import { InMemoryProgramRepository } from './cms/infrastructure/index.js';

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

// --- Global error handler (must be registered early)
registerErrorHandler(app);

// --- Welcome route (TypeBox schema)
const WelcomeSchema = Type.Object({
  message: Type.String(),
  timestamp: Type.String(),
  version: Type.String(),
});
type WelcomeResponse = Static<typeof WelcomeSchema>;

app.get('/', {
  schema: { response: { 200: WelcomeSchema } },
}, async (): Promise<WelcomeResponse> => ({
  message: 'Welcome to Thmanyah API!',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
}));


const programRepository = new InMemoryProgramRepository();

// --- Feature routes
await registerCreateProgramRoute(app, { programRepository });

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
