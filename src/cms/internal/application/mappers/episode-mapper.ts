// application/mappers/episode-mapper.ts
import { Episode } from '../../domain/episode.js';
import type { EpisodeDto } from '../contracts/create-episode-contract.js';

export const toEpisodeDto = (episode: Episode): EpisodeDto => ({
  id: episode.id,
  program_id: episode.program_id,
  title: episode.title,
  slug: episode.slug,
  description: episode.description,
  cover: episode.cover,
  transcripts: episode.transcripts,
  status: episode.status,
  published_at: episode.published_at?.toISOString() ?? null,
  kind: episode.kind,
  source: episode.source,
  created_at: episode.created_at.toISOString(),
  updated_at: episode.updated_at?.toISOString() ?? null,
});

export const toEpisodeDtoArray = (episodes: Episode[]): EpisodeDto[] => 
  episodes.map(toEpisodeDto);
