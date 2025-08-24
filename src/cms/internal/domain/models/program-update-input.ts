import { ProgramType } from '../enums/index.js';
import { isNonEmpty, isValidLanguageCode, isUuid, isEnumValue, DomainValidationError } from '../../../../shared/utilities/index.js';

export type ProgramUpdateInput = {
  title?: string;
  type?: ProgramType;
  description?: string | null;
  cover?: string | null; // asset_id
  language?: string; // ISO-639-1
};

export function validateProgramUpdate(raw: ProgramUpdateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  const out: ProgramUpdateInput = {};

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

  if ('type' in raw && raw.type !== undefined) {
    if (!isEnumValue(ProgramType, raw.type)) {
      issues.push({ field: 'type', message: 'must be a valid ProgramType' });
    } else {
      out.type = raw.type;
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

  if ('language' in raw && raw.language !== undefined) {
    if (!isValidLanguageCode(raw.language)) {
      issues.push({ field: 'language', message: 'must be a valid ISO-639-1 language code' });
    } else {
      out.language = raw.language;
    }
  }

  if (issues.length) throw new DomainValidationError(issues);

  return out;
}
