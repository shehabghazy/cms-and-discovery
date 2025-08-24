import { DomainEvent } from '../../../shared/domain/events/index.js';

export class EpisodePublishedEvent extends DomainEvent {
  public readonly episodeId: string;
  public readonly programId: string;
  public readonly slug: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly kind: string;
  public readonly publishedAt: Date;

  constructor(data: {
    episodeId: string;
    programId: string;
    slug: string;
    title: string;
    description: string | null;
    kind: string;
    publishedAt: Date;
  }) {
    super();
    this.episodeId = data.episodeId;
    this.programId = data.programId;
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.kind = data.kind;
    this.publishedAt = data.publishedAt;
  }

  get type(): string {
    return 'EpisodePublished';
  }

  get details(): Record<string, unknown> {
    return {
      episodeId: this.episodeId,
      programId: this.programId,
      slug: this.slug,
      title: this.title,
      description: this.description,
      kind: this.kind,
      publishedAt: this.publishedAt.toISOString(),
    };
  }
}
