// adapters/http/error-handler.ts
import type { FastifyInstance } from 'fastify';
import { DomainValidationError } from '../index.js';
import { ConflictError, NotFoundError, ValidationError } from '../application/usecase-errors.js';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: any, req, reply) => {
    // 1) Fastify/Ajv validation error (pre-handler)
    if (err?.validation) {
      const details = err.validation.map((e: any) =>
        `${e.instancePath || e.dataPath || e.schemaPath}: ${e.message}`
      );
      return reply.code(400).send({ error: 'Invalid request', details });
    }

    // 2) Domain/application errors
    if (err instanceof DomainValidationError) {
      const details = err.issues.map(i => `${i.field}: ${i.message}`);
      return reply.code(400).send({ error: 'Validation failed', details });
    }
    if (err instanceof ConflictError) {
      return reply.code(409).send({ error: err.message });
    }
    if (err instanceof NotFoundError) {
      return reply.code(404).send({ error: err.message });
    }
    if (err instanceof ValidationError) {
      // For asset availability errors, return 410 Gone
      if (err.message.includes('not available')) {
        return reply.code(410).send({ error: err.message });
      }
      // For other validation errors, return 400
      return reply.code(400).send({ error: err.message });
    }

    // 3) Fallback
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal Server Error' });
  });
}
