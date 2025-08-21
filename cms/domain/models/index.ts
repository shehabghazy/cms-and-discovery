export { 
  type ProgramCreateInput,
  type ProgramUpdateInput,
  validateProgramCreate,
  validateProgramUpdate
} from './Program.js';
export { 
  type EpisodeMetadata, 
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  validateEpisodeCreate,
  validateEpisodeUpdate
} from './Episode.js';
export { DomainValidationError } from '../../../shared/utilities/index.js';
