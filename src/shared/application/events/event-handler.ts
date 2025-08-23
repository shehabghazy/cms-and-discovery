import { DomainEvent } from '../../domain/events/index.js';

export interface IEventHandler {
  handle(event: DomainEvent): Promise<void>;
}
