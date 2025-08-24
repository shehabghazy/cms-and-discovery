import { EpisodeStatus } from '../enums/index.js';
import { EpisodePublishedEvent, EpisodeHiddenEvent } from '../events/index.js';


export interface EpisodeData {
  id: string;
  program_id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: string;
  published_at: Date | null;
}


export type EpisodeDomainEvent = EpisodePublishedEvent | EpisodeHiddenEvent;


export interface EpisodeStatusChangeStrategy {
  handleStatusChange(
    episodeData: EpisodeData,
    addEvent: (event: EpisodeDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void;
}


export class PublishEpisodeStrategy implements EpisodeStatusChangeStrategy {
  handleStatusChange(
    episodeData: EpisodeData,
    addEvent: (event: EpisodeDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void {
    let publishedAt = new Date();
    setPublishedAt(publishedAt);
    addEvent(new EpisodePublishedEvent({
      episodeId: episodeData.id,
      programId: episodeData.program_id,
      slug: episodeData.slug,
      title: episodeData.title,
      description: episodeData.description,
      kind: episodeData.kind,
      publishedAt: publishedAt,
    }));
  }
}


export class HideEpisodeStrategy implements EpisodeStatusChangeStrategy {
  handleStatusChange(
    episodeData: EpisodeData,
    addEvent: (event: EpisodeDomainEvent) => void,
    setPublishedAt: (date: Date) => void
  ): void {
    addEvent(new EpisodeHiddenEvent({
      episodeId: episodeData.id,
    }));
  }
}


export class EpisodeStatusStrategyFactory {
  private static strategies: Map<EpisodeStatus, EpisodeStatusChangeStrategy> = new Map([
    [EpisodeStatus.PUBLISHED, new PublishEpisodeStrategy()],
    [EpisodeStatus.HIDDEN, new HideEpisodeStrategy()],
  ]);

  static getStrategy(status: EpisodeStatus): EpisodeStatusChangeStrategy {
    const strategy = this.strategies.get(status);
    if (!strategy) {
      throw new Error(`No strategy found for episode status: ${status}`);
    }
    return strategy;
  }
}
