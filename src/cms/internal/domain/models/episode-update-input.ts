import { isNonEmpty, isUuid, DomainValidationError } from '../../../../shared/utilities/index.js';

export type EpisodeUpdateInput = {
  title?: string;
  description?: string | null;
  cover?: string | null; // asset_id
  transcripts?: string[]; // list of asset_id UUIDs
};

export function validateEpisodeUpdate(raw: EpisodeUpdateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  const out: EpisodeUpdateInput = {};

  if ('title' in raw && raw.title !== undefined) {
    if (!isNonEmpty(raw.title)) {
      issues.push({ field: 'title', message: 'must be non-empty' });
    } else if (raw.title.trim().length < 10) {
      issues.push({ field: 'title', message: 'must be at least 10 characters' });
    } else if (raw.title.trim().length > 120) {
      issues.push({ field: 'title', message: 'must be 120 characters or less' });
    } else {
      out.title = raw.title.trim();
    }
  }

  if ('description' in raw) {
    if (raw.description !== null && raw.description !== undefined && typeof raw.description === 'string' && raw.description.trim().length > 5000) {
      issues.push({ field: 'description', message: 'must be 5000 characters or less' });
    } else {
      out.description = raw.description?.trim() || null;
    }
  }

  if ('cover' in raw) {
    if (raw.cover !== null && raw.cover !== undefined && typeof raw.cover === 'string' && !isUuid(raw.cover)) {
      issues.push({ field: 'cover', message: 'must be a valid asset ID (UUID)' });
    } else {
      out.cover = raw.cover || null;
    }
  }

  if ('transcripts' in raw) {
    if (raw.transcripts !== null && raw.transcripts !== undefined) {
      if (!Array.isArray(raw.transcripts)) {
        issues.push({ field: 'transcripts', message: 'must be an array of asset IDs' });
      } else {
        for (let i = 0; i < raw.transcripts.length; i++) {
          if (!isUuid(raw.transcripts[i])) {
            issues.push({ field: `transcripts[${i}]`, message: 'must be a valid asset ID (UUID)' });
          }
        }
        if (issues.length === 0) {
          out.transcripts = raw.transcripts;
        }
      }
    } else {
      out.transcripts = [];
    }
  }

  if (issues.length) throw new DomainValidationError(issues);

  return out;
}
