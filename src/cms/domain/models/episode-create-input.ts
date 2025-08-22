import { EpisodeKind, EpisodeStatus } from '../enums/index.js';
import { isUuid, isNonEmpty, isValidSlug, isEnumValue, DomainValidationError } from '../../../shared/utilities/index.js';

export type EpisodeCreateInput = {
  id: string;
  program_id: string;
  title: string;
  slug: string;
  kind: EpisodeKind;
  source: string; // asset_id
  description?: string | null;
  cover?: string | null; // asset_id
  transcripts?: string[]; // list of asset_id UUIDs
  created_at?: Date;
  updated_at?: Date | null;
};

export function validateEpisodeCreate(raw: EpisodeCreateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(raw.id)) issues.push({ field: 'id', message: 'must be a UUID' });
  if (!isUuid(raw.program_id)) issues.push({ field: 'program_id', message: 'must be a UUID' });

  if (!isNonEmpty(raw.title)) {
    issues.push({ field: 'title', message: 'must be non-empty' });
  } else if (raw.title.trim().length < 10) {
    issues.push({ field: 'title', message: 'must be at least 10 characters' });
  } else if (raw.title.trim().length > 120) {
    issues.push({ field: 'title', message: 'must be 120 characters or less' });
  }

  if (!isValidSlug(raw.slug)) {
    issues.push({ field: 'slug', message: 'must be a valid slug (lowercase letters, numbers, hyphens only, max 80 chars)' });
  }

  if (!isEnumValue(EpisodeKind, raw.kind)) {
    issues.push({ field: 'kind', message: 'must be a valid EpisodeKind (audio or video)' });
  }

  // Source is required and must be a valid asset_id (UUID)
  if (!isUuid(raw.source)) {
    issues.push({ field: 'source', message: 'must be a valid asset ID (UUID)' });
  }

  // Optional description validation
  if (raw.description !== undefined && raw.description !== null && typeof raw.description === 'string' && raw.description.trim().length > 5000) {
    issues.push({ field: 'description', message: 'must be 5000 characters or less' });
  }

  // Optional cover validation - should be a valid asset_id (UUID)
  if (raw.cover !== undefined && raw.cover !== null && typeof raw.cover === 'string' && !isUuid(raw.cover)) {
    issues.push({ field: 'cover', message: 'must be a valid asset ID (UUID)' });
  }

  // Optional transcripts validation - each should be a valid asset_id (UUID)
  if (raw.transcripts !== undefined && raw.transcripts !== null) {
    if (!Array.isArray(raw.transcripts)) {
      issues.push({ field: 'transcripts', message: 'must be an array of asset IDs' });
    } else {
      for (let i = 0; i < raw.transcripts.length; i++) {
        if (!isUuid(raw.transcripts[i])) {
          issues.push({ field: `transcripts[${i}]`, message: 'must be a valid asset ID (UUID)' });
        }
      }
    }
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    id: raw.id,
    program_id: raw.program_id,
    title: raw.title.trim(),
    slug: raw.slug.trim(),
    kind: raw.kind,
    source: raw.source,
    description: raw.description?.trim() || null,
    cover: raw.cover || null,
    transcripts: raw.transcripts || [],
    status: EpisodeStatus.DRAFT, // Always set to draft for new episodes
    published_at: null, // Always null for new episodes
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  } as const;
}
