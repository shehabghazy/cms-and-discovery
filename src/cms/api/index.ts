// Re-export CMS routes registration
export { registerCMSRoutes } from './cms-routes.js';

// Export the event handlers registration
export { registerCMSEventHandlers } from './cms-event-handlers.js';

// Re-export individual route modules
export * from './create-program-route.js';
export * from './update-program-route.js';
export * from './change-program-status-route.js';
export * from './list-programs-route.js';
export * from './episode-routes.js';
