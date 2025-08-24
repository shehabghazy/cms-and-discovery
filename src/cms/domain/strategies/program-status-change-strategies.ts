import { ProgramStatus } from '../enums/index.js';
import { ProgramPublishedEvent, ProgramArchivedEvent } from '../events/index.js';

// Shared type for program data
export interface ProgramData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  language: string;
  published_at: Date | null;
}

// Type for domain events
export type ProgramDomainEvent = ProgramPublishedEvent | ProgramArchivedEvent;

// Strategy interface for handling status changes
export interface ProgramStatusChangeStrategy {
  handleStatusChange(
    programData: ProgramData,
    addEvent: (event: ProgramDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void;
}

// Strategy for publishing a program
export class PublishProgramStrategy implements ProgramStatusChangeStrategy {
  handleStatusChange(
    programData: ProgramData,
    addEvent: (event: ProgramDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void {
    // Handle published_at logic
    let publishedAt = programData.published_at;
    if (publishedAt === null) {
      publishedAt = new Date();
      setPublishedAt(publishedAt);
    }

    // Emit ProgramPublishedEvent when program is published
    addEvent(new ProgramPublishedEvent({
      programId: programData.id,
      slug: programData.slug,
      title: programData.title,
      description: programData.description,
      programType: programData.type,
      language: programData.language,
      publishedAt: publishedAt,
    }));
  }
}

// Strategy for archiving a program
export class ArchiveProgramStrategy implements ProgramStatusChangeStrategy {
  handleStatusChange(
    programData: ProgramData,
    addEvent: (event: ProgramDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void {
    // Emit ProgramArchivedEvent when program is archived
    addEvent(new ProgramArchivedEvent({
      programId: programData.id,
    }));
  }
}

// Strategy registry
export class ProgramStatusChangeStrategyRegistry {
  private static strategies: Map<ProgramStatus, ProgramStatusChangeStrategy> = new Map([
    [ProgramStatus.PUBLISHED, new PublishProgramStrategy()],
    [ProgramStatus.ARCHIVED, new ArchiveProgramStrategy()],
  ]);

  static getStrategy(status: ProgramStatus): ProgramStatusChangeStrategy {
    const strategy = this.strategies.get(status);
    if (!strategy) {
      throw new Error(`No strategy found for program status: ${status}`);
    }
    return strategy;
  }
}
