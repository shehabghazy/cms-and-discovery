import { CommandUseCase } from '../../../shared/index.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';
import type { EpisodeUpdateDto } from '../contracts/update-episode-contract.js';
import { Episode, type EpisodeRepository } from '../../domain/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { NotFoundError } from '../../../shared/application/usecase-errors.js';

export type UpdateEpisodeInput = { 
  episodeId: string; 
  updateData: EpisodeUpdateDto; 
};
export type UpdateEpisodeOutput = { episode: EpisodeDto };

export class UpdateEpisodeUseCase extends CommandUseCase<UpdateEpisodeInput, UpdateEpisodeOutput> {
  constructor(private readonly repo: EpisodeRepository) {
    super();
  }
  
  async execute(input: UpdateEpisodeInput): Promise<UpdateEpisodeOutput> {
    
    // Find the existing episode
    const episode = await this.repo.findById(input.episodeId);
    if (!episode) {
      throw new NotFoundError(`Episode with ID '${input.episodeId}' not found`);
    }
    
    // Domain validation happens inside episode.update()
    episode.update({
      title: input.updateData.title,
      description: input.updateData.description,
      cover: input.updateData.cover,
      transcripts: input.updateData.transcripts
    });
    
    await this.repo.save(episode);
    
    return { episode: toEpisodeDto(episode) };
  }
}
