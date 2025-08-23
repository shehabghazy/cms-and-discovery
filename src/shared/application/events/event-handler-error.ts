/**
 * Error thrown when an event handler fails to process an event
 */
export class EventHandlerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventHandlerError';
  }
}
