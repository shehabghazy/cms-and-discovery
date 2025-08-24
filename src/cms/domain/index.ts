import { DomainBase } from '../../shared/domain/domain-base.js';
import { Program } from './program.js';
import { Episode } from './episode.js';
import { 
  type ProgramCreateInput, 
  type ProgramUpdateInput,
  type ProgramChangeStatusInput,
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  type EpisodeChangeStatusInput,
  type EpisodeMoveToProgram,
  type ListProgramsInput,
  type ListProgramsFilters,
  type ListEpisodesInput,
  type ListEpisodesFilters,
} from './models/index.js';
import { ProgramType, ProgramStatus, EpisodeStatus, EpisodeKind, Language } from './enums/index.js';
import { ProgramRepository, EpisodeRepository } from './ports/index.js';

export {
  // Base classes
  DomainBase,
  
  // Entities
  Program,
  Episode,
  
  // Types
  type ProgramCreateInput,
  type ProgramUpdateInput,
  type ProgramChangeStatusInput,
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  type EpisodeChangeStatusInput,
  type EpisodeMoveToProgram,
  type ListProgramsInput,
  type ListProgramsFilters,
  type ListEpisodesInput,
  type ListEpisodesFilters,
  
  // Enums
  ProgramType,
  ProgramStatus,
  EpisodeStatus,
  EpisodeKind,
  Language,
  
  // Ports (Interfaces)
  type ProgramRepository,
  type EpisodeRepository
};

// Export events
export * from './events/index.js';
