import { EventBus, IEventHandler, EventHandlerError } from '../../application/events/index.js';
import { DomainEvent } from '../../domain/events/index.js';

export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, IEventHandler<DomainEvent>[]> = new Map();

  /**
   * Subscribes a handler to a specific event type
   * @param eventType The type of event to listen for
   * @param handler The handler instance to handle the event
   */
  subscribe<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    const eventHandlers = this.subscribers.get(eventType)!;
    // Type assertion is safe here because all DomainEvent handlers can handle DomainEvent
    if (!eventHandlers.includes(handler as IEventHandler<DomainEvent>)) {
      eventHandlers.push(handler as IEventHandler<DomainEvent>);
      console.log(`🔔 Subscribed ${handler.constructor.name} to event type '${eventType}'. Total handlers: ${eventHandlers.length}`);
    } else {
      console.log(`⚠️  Handler ${handler.constructor.name} already subscribed to event type '${eventType}'`);
    }
  }

  /**
   * Unsubscribes a handler from a specific event type
   * @param eventType The type of event to stop listening for
   * @param handler The handler instance to unsubscribe
   */
  unsubscribe<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void {
    const eventHandlers = this.subscribers.get(eventType);
    if (!eventHandlers) {
      return;
    }
    
    const index = eventHandlers.indexOf(handler as IEventHandler<DomainEvent>);
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
    
    console.log(`📢 Publishing event: ${event.type} (ID: ${event.id})`);
    console.log(`📍 Event handlers found: ${eventHandlers.length} for event type '${event.type}'`);
    
    if (eventHandlers.length === 0) {
      console.warn(`⚠️  No handlers registered for event type '${event.type}'`);
      return;
    }
    
    // Log handler details
    eventHandlers.forEach((handler, index) => {
      console.log(`   Handler ${index + 1}: ${handler.constructor.name}`);
    });
    
    // Execute all handlers for this event type in parallel
    const promises = eventHandlers.map(handler => this.executeHandler(handler, event));
    await Promise.all(promises);
    
    console.log(`✅ Successfully published event: ${event.type} (ID: ${event.id})`);
  }

  /**
   * Publishes multiple domain events in sequence
   * @param events Array of domain events to publish
   */
  async publishAll(events: DomainEvent[]): Promise<void> {
    console.log(`📦 Publishing ${events.length} events in sequence`);
    for (const event of events) {
      await this.publish(event);
    }
    console.log(`✅ All ${events.length} events published successfully`);
  }


  /**
   * Executes a handler with error handling
   * @param handler The handler to execute
   * @param event The event to pass to the handler
   */
  private async executeHandler(handler: IEventHandler<DomainEvent>, event: DomainEvent): Promise<void> {
    try {
      console.log(`🔄 Executing handler ${handler.constructor.name} for event ${event.type} (${event.id})`);
      await handler.handle(event);
      console.log(`✅ Handler ${handler.constructor.name} completed successfully for event ${event.type} (${event.id})`);
    } catch (error) {
      // Log the error but don't stop other handlers from executing
      const errorMessage = `Event handler '${handler.constructor.name}' failed to process event '${event.type}' (${event.id}): ${error instanceof Error ? error.message : String(error)}`;
      
      console.error(`❌ ${errorMessage}`);
      
      // In a production environment, you might want to:
      // - Use a proper logger
      // - Implement retry logic  
      // - Send to dead letter queues
      // - Emit monitoring events
      // - Throw EventHandlerError for higher-level handling
    }
  }
}
