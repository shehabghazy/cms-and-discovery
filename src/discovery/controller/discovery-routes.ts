import type { FastifyInstance } from 'fastify';
import { SearchEngine } from '../../shared/domain/ports/search-engine/search-engine-port.js';
import { registerSearchRoute } from './search-route.js';

// Export individual route functions like CMS
export * from './search-route.js';

export interface DiscoveryDependencies {
  searchEngine: SearchEngine;
}

export function registerDiscoveryRoutes(
  app: FastifyInstance,
  dependencies: DiscoveryDependencies
) {
  // Register discovery search route under /discovery prefix
  app.register(async (discoveryApp) => {
    // Search endpoint only
    registerSearchRoute(discoveryApp, dependencies);
  }, { prefix: '/api/v1/discovery' });
}
