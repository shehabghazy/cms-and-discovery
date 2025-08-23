import { randomUUID } from 'crypto';

export abstract class DomainEvent {
  readonly id: string;
  readonly occurredOn: Date;
  abstract type: string;
  abstract details: Record<string, unknown>;

  constructor() {
    this.id = randomUUID();
    this.occurredOn = new Date();
  }
}
