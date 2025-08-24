import { DomainEvent } from '../../domain/events/index.js';
import { IEventHandler } from './event-handler.js';

export interface EventBus {
  /**
   * Publishes a domain event to all registered handlers
   * @param event The domain event to publish
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publishes multiple domain events in sequence
   * @param events Array of domain events to publish
   */
  publishAll(events: DomainEvent[]): Promise<void>;

  /**
   * Subscribes a handler to a specific event type
   * @param eventType The type of event to listen for
   * @param handler The handler instance to handle the event
   */
  subscribe<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void;

  /**
   * Unsubscribes a handler from a specific event type
   * @param eventType The type of event to stop listening for
   * @param handler The handler instance to unsubscribe
   */
  unsubscribe<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void;
}
