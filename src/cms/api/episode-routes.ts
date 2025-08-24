import type { FastifyInstance } from 'fastify';
import { type EpisodeRepository, type ProgramRepository } from '../domain/index.js';
import { EventBus } from '../../shared/application/events/event-bus.js';
import { registerCreateEpisodeRoute } from './create-episode-route.js';
import { registerUpdateEpisodeRoute } from './update-episode-route.js';
import { registerChangeEpisodeStatusRoute } from './change-episode-status-route.js';
import { registerMoveEpisodeToProgramRoute } from './move-episode-to-program-route.js';
import { registerListEpisodesRoute } from './list-episodes-route.js';

export function registerEpisodeRoutes(app: FastifyInstance, dependencies: {
  episodeRepository: EpisodeRepository;
  programRepository: ProgramRepository;
  eventBus: EventBus;
}) {
  registerListEpisodesRoute(app, { episodeRepository: dependencies.episodeRepository });
  registerCreateEpisodeRoute(app, { 
    episodeRepository: dependencies.episodeRepository, 
    programRepository: dependencies.programRepository 
  });
  registerUpdateEpisodeRoute(app, { episodeRepository: dependencies.episodeRepository });
  registerChangeEpisodeStatusRoute(app, { 
    episodeRepository: dependencies.episodeRepository,
    eventBus: dependencies.eventBus
  });
  registerMoveEpisodeToProgramRoute(app, { 
    episodeRepository: dependencies.episodeRepository, 
    programRepository: dependencies.programRepository 
  });
  
  console.log('All episode routes registered');
}

export * from './create-episode-route.js';
export * from './update-episode-route.js';
export * from './change-episode-status-route.js';
export * from './move-episode-to-program-route.js';
export * from './list-episodes-route.js';
