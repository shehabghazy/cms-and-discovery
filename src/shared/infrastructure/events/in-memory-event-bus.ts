import { EventBus, IEventHandler, EventHandlerError } from '../../application/events/index.js';
import { DomainEvent } from '../../domain/events/index.js';

export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, IEventHandler[]> = new Map();

  /**
   * Subscribes a handler to a specific event type
   * @param eventType The type of event to listen for
   * @param handler The handler instance to handle the event
   */
  subscribe(eventType: string, handler: IEventHandler): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    const eventHandlers = this.subscribers.get(eventType)!;
    if (!eventHandlers.includes(handler)) {
      eventHandlers.push(handler);
    }
  }

  /**
   * Unsubscribes a handler from a specific event type
   * @param eventType The type of event to stop listening for
   * @param handlerThe handler instance to unsubscribe
   */
  unsubscribe(eventType: string, handler: IEventHandler): void {
    const eventHandlers = this.subscribers.get(eventType);
    if (!eventHandlers) {
      return;
    }
    
    const index = eventHandlers.indexOf(handler);
    if (index > -1) {
      eventHandlers.splice(index, 1);
    }
    
    // Clean up empty arrays
    if (eventHandlers.length === 0) {
      this.subscribers.delete(eventType);
    }
  }

  /**
   * Publishes a domain event to all registered handlers
   * @param event The domain event to publish
   */
  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.subscribers.get(event.type) || [];
    
    // Execute all handlers for this event type in parallel
    const promises = eventHandlers.map(handler => this.executeHandler(handler, event));
    await Promise.all(promises);
  }

  /**
   * Publishes multiple domain events in sequence
   * @param events Array of domain events to publish
   */
  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }


  /**
   * Executes a handler with error handling
   * @param handler The handler to execute
   * @param event The event to pass to the handler
   */
  private async executeHandler(handler: IEventHandler, event: DomainEvent): Promise<void> {
    try {
      await handler.handle(event);
    } catch (error) {
      // Log the error but don't stop other handlers from executing
      const errorMessage = `Event handler '${handler.constructor.name}' failed to process event '${event.type}' (${event.id}): ${error instanceof Error ? error.message : String(error)}`;
      
      console.error(errorMessage);
      
      // In a production environment, you might want to:
      // - Use a proper logger
      // - Implement retry logic  
      // - Send to dead letter queues
      // - Emit monitoring events
      // - Throw EventHandlerError for higher-level handling
    }
  }
}
