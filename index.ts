import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const fastify: FastifyInstance = Fastify({
  logger: true
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const HOST: string = process.env.HOST || '0.0.0.0';

interface WelcomeResponse {
  message: string;
  timestamp: string;
  version: string;
}

fastify.route({
  method: 'GET',
  url: '/',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          timestamp: { type: 'string' },
          version: { type: 'string' }
        }
      }
    }
  },
  handler: async (request: FastifyRequest, reply: FastifyReply): Promise<WelcomeResponse> => {
    return { 
      message: 'Welcome to Thmanyah API!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
});

process.on('SIGINT', async (): Promise<void> => {
  fastify.log.info('Received SIGINT, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async (): Promise<void> => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

try {
  await fastify.listen({ port: PORT, host: HOST });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
