import { CommandUseCase } from '../../../../shared/index.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';
import type { EpisodeChangeStatusDto } from '../contracts/change-episode-status-contract.js';
import { EpisodeStatus, type EpisodeRepository } from '../../domain/index.js';
import { EpisodePublishedEvent, EpisodeHiddenEvent } from '../../domain/events/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { NotFoundError } from '../../../../shared/application/usecase-errors.js';
import { EventBus } from '../../../../shared/application/events/event-bus.js';

export type ChangeEpisodeStatusInput = { 
  episodeId: string; 
  statusData: EpisodeChangeStatusDto; 
};
export type ChangeEpisodeStatusOutput = { episode: EpisodeDto };

export class ChangeEpisodeStatusUseCase extends CommandUseCase<ChangeEpisodeStatusInput, ChangeEpisodeStatusOutput> {
  constructor(
    private readonly repo: EpisodeRepository,
    private readonly eventBus: EventBus
  ) {
    super();
  }
  
  async execute(input: ChangeEpisodeStatusInput): Promise<ChangeEpisodeStatusOutput> {
    
    // Find the existing episode
    const episode = await this.repo.findById(input.episodeId);
    if (!episode) {
      throw new NotFoundError(`Episode with ID '${input.episodeId}' not found`);
    }
    
    // Domain validation and business rules happen inside episode.changeStatus()
    episode.changeStatus({
      status: input.statusData.status as EpisodeStatus.PUBLISHED | EpisodeStatus.HIDDEN,
    });
    
    // Save the episode first
    await this.repo.save(episode);
    console.log(`💾 Episode ${episode.id} saved with new status: ${input.statusData.status}`);
    
    // Publish relevant status change events
    const domainEvents = episode.getDomainEvents();
    console.log(`🔍 Found ${domainEvents.length} domain events on episode ${episode.id}`);
    
    const statusEvents = domainEvents.filter(event => 
      event instanceof EpisodePublishedEvent || event instanceof EpisodeHiddenEvent
    );
    console.log(`📋 Filtered to ${statusEvents.length} status change event(s)`);
    
    if (statusEvents.length > 0) {
      console.log(`🚀 Publishing ${statusEvents.length} status change event(s) for episode ${episode.id}`);
      await this.eventBus.publishAll(statusEvents);
      episode.removeEvents(statusEvents);
    } else {
      console.log(`ℹ️  No status change events to publish for episode ${episode.id}`);
    }
    
    return { episode: toEpisodeDto(episode) };
  }
}
