import { DomainEvent } from './events/index.js';

export abstract class DomainBase {
  public id: string;
  public created_at: Date;
  public updated_at: Date | null;
  private _domainEvents: DomainEvent[] = [];

  constructor(id: string, created_at?: Date, updated_at?: Date | null) {
    this.id = id;
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? null;
  }

  protected touch(): void {
    this.updated_at = new Date();
  }

  public equals(other: DomainBase): boolean {
    if (!(other instanceof DomainBase)) {
      return false;
    }
    return this.id === other.id;
  }

  public toObject(): Record<string, any> {
    return {
      id: this.id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Add a domain event to be published later
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Get all unpublished domain events
   */
  public getDomainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Clear all domain events (typically called after publishing)
   */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Remove specific domain events (typically called after selective publishing)
   */
  public removeEvents(eventsToRemove: DomainEvent[]): void {
    this._domainEvents = this._domainEvents.filter(
      event => !eventsToRemove.includes(event)
    );
  }

  /**
   * Check if there are any unpublished domain events
   */
  public hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }
}
