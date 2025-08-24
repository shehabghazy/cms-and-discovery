import { CommandUseCase } from '../../../../shared/index.js';
import type { EpisodeDto, EpisodeCreateDto } from '../contracts/create-episode-contract.js';
import { Episode, EpisodeKind, type EpisodeRepository, type ProgramRepository } from '../../domain/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { ConflictError, NotFoundError } from '../../../../shared/application/usecase-errors.js';

export type CreateEpisodeInput = { episodeData: EpisodeCreateDto };
export type CreateEpisodeOutput = { episode: EpisodeDto };

export class CreateEpisodeUseCase extends CommandUseCase<CreateEpisodeInput, CreateEpisodeOutput> {
  constructor(
    private readonly episodeRepo: EpisodeRepository,
    private readonly programRepo: ProgramRepository
  ) {
    super();
  }
  
  async execute(input: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    
    // Check if the program exists
    const program = await this.programRepo.findById(input.episodeData.program_id);
    if (!program) {
      throw new NotFoundError(`Program with ID '${input.episodeData.program_id}' not found`);
    }
    
    // Check for slug conflicts within the program (async business rule)
    const existingEpisode = await this.episodeRepo.findBySlugInProgram(
      input.episodeData.program_id, 
      input.episodeData.slug
    );
    if (existingEpisode) {
      throw new ConflictError(`Episode with slug '${input.episodeData.slug}' already exists in this program`);
    }
    
    // Domain validation happens inside Episode.create()
    const episode = Episode.create({
      id: crypto.randomUUID(), // Generate UUID for new episode
      program_id: input.episodeData.program_id,
      title: input.episodeData.title,
      slug: input.episodeData.slug,
      kind: input.episodeData.kind as EpisodeKind,
      source: input.episodeData.source,
      description: input.episodeData.description || null,
      cover: input.episodeData.cover || null,
      transcripts: input.episodeData.transcripts || []
    });
    
    await this.episodeRepo.save(episode);
    
    return { episode: toEpisodeDto(episode) };
  }
}
