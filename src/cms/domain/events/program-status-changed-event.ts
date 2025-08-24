import { DomainEvent } from '../../../shared/domain/events/index.js';
import { ProgramStatus } from '../enums/index.js';

export class ProgramStatusChangedEvent extends DomainEvent {
  public readonly programId: string;
  public readonly slug: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly programType: string;
  public readonly language: string;
  public readonly previousStatus: ProgramStatus;
  public readonly newStatus: ProgramStatus;
  public readonly publishedAt: Date | null;

  constructor(data: {
    programId: string;
    slug: string;
    title: string;
    description: string | null;
    programType: string;
    language: string;
    previousStatus: ProgramStatus;
    newStatus: ProgramStatus;
    publishedAt: Date | null;
  }) {
    super();
    this.programId = data.programId;
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.programType = data.programType;
    this.language = data.language;
    this.previousStatus = data.previousStatus;
    this.newStatus = data.newStatus;
    this.publishedAt = data.publishedAt;
  }

  get type(): string {
    return 'ProgramStatusChanged';
  }

  public get details(): Record<string, any> {
    return {
      programId: this.programId,
      slug: this.slug,
      title: this.title,
      description: this.description,
      programType: this.programType,
      language: this.language,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
      publishedAt: this.publishedAt,
    };
  }
}
