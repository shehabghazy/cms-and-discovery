import { DomainBase } from '../../shared/domain/domain-base';
import { Program } from './program.js';
import { Episode } from './episode.js';
import { 
  type ProgramCreateInput, 
  type ProgramUpdateInput, 
  type EpisodeMetadata, 
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  type ListProgramsInput,
  type ListProgramsFilters,
} from './models/index.js';
import { ProgramType, ProgramStatus, Language } from './enums/index.js';
import { ProgramRepository } from './ports/index.js';

export {
  // Base classes
  DomainBase,
  
  // Entities
  Program,
  Episode,
  
  // Types
  type ProgramCreateInput,
  type ProgramUpdateInput,
  type EpisodeMetadata,
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  type ListProgramsInput,
  type ListProgramsFilters,
  
  // Enums
  ProgramType,
  ProgramStatus,
  Language,
  
  // Ports (Interfaces)
  type ProgramRepository
};
