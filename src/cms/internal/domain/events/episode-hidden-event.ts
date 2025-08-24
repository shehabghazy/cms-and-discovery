import { DomainEvent } from '../../../../shared/domain/events/index.js';

export class EpisodeHiddenEvent extends DomainEvent {
  public readonly episodeId: string;

  constructor(data: {
    episodeId: string;
  }) {
    super();
    this.episodeId = data.episodeId;
  }

  get type(): string {
    return 'EpisodeHidden';
  }

  get details(): Record<string, unknown> {
    return {
      episodeId: this.episodeId,
    };
  }
}
