import type { FastifyInstance } from 'fastify';
import { type ProgramRepository, type EpisodeRepository } from '../domain/index.js';
import { EventBus } from '../../shared/application/events/event-bus.js';
import { registerProgramRoutes } from './program-routes.js';
import { registerEpisodeRoutes } from './episode-routes.js';

export function registerCMSRoutes(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
  episodeRepository: EpisodeRepository;
  eventBus: EventBus;
}) {
  // Register routes with /api/v1/cms prefix
  app.register(async function cmsRoutesV1(app) {
    registerProgramRoutes(app, { 
      programRepository: dependencies.programRepository,
      eventBus: dependencies.eventBus
    });
    registerEpisodeRoutes(app, {
      programRepository: dependencies.programRepository,
      episodeRepository: dependencies.episodeRepository,
      eventBus: dependencies.eventBus
    });
  }, { prefix: '/api/v1/cms' });
  
  console.log('All CMS routes registered with /api/v1/cms prefix');
}
