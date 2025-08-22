import { DomainBase } from '../../shared/abstractions/DomainBase';
import { Program } from './Program.js';
import { Episode } from './Episode.js';
import { 
  type ProgramCreateInput, 
  type ProgramUpdateInput, 
  type EpisodeMetadata, 
  type EpisodeCreateInput,
  type EpisodeUpdateInput
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
  
  // Enums
  ProgramType,
  ProgramStatus,
  Language,
  
  // Ports (Interfaces)
  type ProgramRepository
};
