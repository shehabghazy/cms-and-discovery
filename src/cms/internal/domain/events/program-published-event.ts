import { DomainEvent } from '../../../../shared/domain/events/index.js';

export class ProgramPublishedEvent extends DomainEvent {
  public readonly programId: string;
  public readonly slug: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly programType: string;
  public readonly language: string;
  public readonly publishedAt: Date;

  constructor(data: {
    programId: string;
    slug: string;
    title: string;
    description: string | null;
    programType: string;
    language: string;
    publishedAt: Date;
  }) {
    super();
    this.programId = data.programId;
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.programType = data.programType;
    this.language = data.language;
    this.publishedAt = data.publishedAt;
  }

  get type(): string {
    return 'ProgramPublished';
  }

  get details(): Record<string, unknown> {
    return {
      programId: this.programId,
      slug: this.slug,
      title: this.title,
      description: this.description,
      programType: this.programType,
      language: this.language,
      publishedAt: this.publishedAt.toISOString(),
    };
  }
}
