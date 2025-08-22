import { QueryListUseCase, QueryListResult, PaginationMeta } from '../../../shared/index.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';
import { Episode, type EpisodeRepository } from '../../domain/index.js';
import { toEpisodeDto } from '../mappers/episode-mapper.js';
import { 
  ListEpisodesInput, 
  ListEpisodesFilters 
} from '../../domain/models/list-episodes-input.js';

export type ListEpisodesOutput = { 
  episodes: EpisodeDto[];
  pagination: PaginationMeta;
};

export class ListEpisodesUseCase extends QueryListUseCase<Episode, EpisodeDto, ListEpisodesFilters> {
  constructor(episodeRepository: EpisodeRepository) {
    super(episodeRepository);
  }

  protected validateFilters(filters: ListEpisodesFilters): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const { status, kind, program_id, search } = filters;
    
    if (status && !['draft', 'published', 'hidden'].includes(status)) {
      errors.push('status: must be one of draft, published, hidden');
    }
    
    if (kind && !['audio', 'video'].includes(kind)) {
      errors.push('kind: must be one of audio, video');
    }
    
    if (program_id && (typeof program_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(program_id))) {
      errors.push('program_id: must be a valid UUID');
    }
    
    if (search && (typeof search !== 'string' || search.length === 0 || search.length > 100)) {
      errors.push('search: must be a non-empty string with max 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  protected mapToDto(episode: Episode): EpisodeDto {
    return toEpisodeDto(episode);
  }

  // Public method for API compatibility that transforms the result
  async executeForApi(input: ListEpisodesInput): Promise<ListEpisodesOutput> {
    const result = await super.execute(input);
    
    // Transform result.data to result.episodes for backward compatibility
    return {
      episodes: result.data,
      pagination: result.pagination
    };
  }
}
