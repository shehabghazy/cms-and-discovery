export { 
  type ProgramCreateInput,
  type ProgramUpdateInput,
  validateProgramCreate,
  validateProgramUpdate
} from './program-dto.js';
export { 
  type EpisodeMetadata, 
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  validateEpisodeCreate,
  validateEpisodeUpdate
} from './episode-dto.js';
export { DomainValidationError } from '../../../shared/utilities/index.js';
