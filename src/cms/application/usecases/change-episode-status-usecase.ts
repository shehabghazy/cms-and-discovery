import { CommandUseCase } from '../../../shared/index.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';
import type { EpisodeChangeStatusDto } from '../contracts/change-episode-status-contract.js';
import { EpisodeStatus, type EpisodeRepository } from '../../domain/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type ChangeEpisodeStatusInput = { 
  episodeId: string; 
  statusData: EpisodeChangeStatusDto; 
};
export type ChangeEpisodeStatusOutput = { episode: EpisodeDto };

export class ChangeEpisodeStatusUseCase extends CommandUseCase<ChangeEpisodeStatusInput, ChangeEpisodeStatusOutput> {
  constructor(private readonly repo: EpisodeRepository) {
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
    
    await this.repo.save(episode);
    
    return { episode: toEpisodeDto(episode) };
  }
}
