import { DomainEvent } from '../../domain/events/index.js';

export interface IEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}
