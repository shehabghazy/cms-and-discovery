import type { FastifyInstance } from 'fastify';
import { type ProgramRepository } from '../domain/index.js';
import { EventBus } from '../../../shared/application/events/event-bus.js';
import { registerCreateProgramRoute } from './create-program-route.js';
import { registerUpdateProgramRoute } from './update-program-route.js';
import { registerChangeProgramStatusRoute } from './change-program-status-route.js';
import { registerListProgramsRoute } from './list-programs-route.js';

export function registerProgramRoutes(app: FastifyInstance, dependencies: {
  programRepository: ProgramRepository;
  eventBus: EventBus;
}) {
  registerListProgramsRoute(app, { programRepository: dependencies.programRepository });
  registerCreateProgramRoute(app, { programRepository: dependencies.programRepository });
  registerUpdateProgramRoute(app, { programRepository: dependencies.programRepository });
  registerChangeProgramStatusRoute(app, dependencies); // This one needs the event bus
  
  console.log('All program routes registered');
}
