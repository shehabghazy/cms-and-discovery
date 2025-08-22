import { CommandUseCase } from '../../../shared/index.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';
import type { EpisodeMoveToProgram } from '../contracts/move-episode-to-program-contract.js';
import { type EpisodeRepository, type ProgramRepository } from '../../domain/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { ConflictError, NotFoundError } from '../../../shared/application/usecase-errors.js';

export type MoveEpisodeToProgramInput = { 
  episodeId: string; 
  moveData: EpisodeMoveToProgram; 
};
export type MoveEpisodeToProgramOutput = { episode: EpisodeDto };

export class MoveEpisodeToProgramUseCase extends CommandUseCase<MoveEpisodeToProgramInput, MoveEpisodeToProgramOutput> {
  constructor(
    private readonly episodeRepo: EpisodeRepository,
    private readonly programRepo: ProgramRepository
  ) {
    super();
  }
  
  async execute(input: MoveEpisodeToProgramInput): Promise<MoveEpisodeToProgramOutput> {
    
    // Find the existing episode
    const episode = await this.episodeRepo.findById(input.episodeId);
    if (!episode) {
      throw new NotFoundError(`Episode with ID '${input.episodeId}' not found`);
    }
    
    // Check if the target program exists
    const targetProgram = await this.programRepo.findById(input.moveData.program_id);
    if (!targetProgram) {
      throw new NotFoundError(`Target program with ID '${input.moveData.program_id}' not found`);
    }
    
    // Check for slug conflicts in the target program (async business rule)
    const existingEpisode = await this.episodeRepo.findBySlugInProgram(
      input.moveData.program_id, 
      input.moveData.slug
    );
    if (existingEpisode && existingEpisode.id !== episode.id) {
      throw new ConflictError(`Episode with slug '${input.moveData.slug}' already exists in the target program`);
    }
    
    // Domain validation happens inside episode.moveToProgram()
    episode.moveToProgram({
      program_id: input.moveData.program_id,
      slug: input.moveData.slug
    });
    
    await this.episodeRepo.save(episode);
    
    return { episode: toEpisodeDto(episode) };
  }
}
