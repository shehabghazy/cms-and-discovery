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
  registerProgramRoutes(app, { 
    programRepository: dependencies.programRepository,
    eventBus: dependencies.eventBus
  });
  registerEpisodeRoutes(app, {
    programRepository: dependencies.programRepository,
    episodeRepository: dependencies.episodeRepository,
    eventBus: dependencies.eventBus
  });
  
  console.log('All CMS routes registered');
}
