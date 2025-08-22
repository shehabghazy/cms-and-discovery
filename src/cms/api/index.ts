import type { FastifyInstance } from 'fastify';
import { type ProgramRepository, type EpisodeRepository } from '../domain/index.js';
import { registerCreateProgramRoute } from './create-program-route.js';
import { registerUpdateProgramRoute } from './update-program-route.js';
import { registerChangeProgramStatusRoute } from './change-program-status-route.js';
import { registerListProgramsRoute } from './list-programs-route.js';
import { registerEpisodeRoutes } from './episode-routes.js';

export function registerProgramRoutes(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
}) {
  registerListProgramsRoute(app, dependencies);
  registerCreateProgramRoute(app, dependencies);
  registerUpdateProgramRoute(app, dependencies);
  registerChangeProgramStatusRoute(app, dependencies);
  
  console.log('All program routes registered');
}

export function registerCMSRoutes(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
  episodeRepository: EpisodeRepository;
}) {
  registerProgramRoutes(app, { programRepository: dependencies.programRepository });
  registerEpisodeRoutes(app, dependencies);
  
  console.log('All CMS routes registered');
}

export * from './create-program-route.js';
export * from './update-program-route.js';
export * from './change-program-status-route.js';
export * from './list-programs-route.js';
export * from './episode-routes.js';
