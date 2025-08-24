import { ProgramType, ProgramStatus } from '../enums/index.js';
import { isUuid, isNonEmpty, isValidSlug, isValidLanguageCode, isEnumValue, DomainValidationError } from '../../../../shared/utilities/index.js';

export type ProgramCreateInput = {
  id: string;
  title: string;
  type: ProgramType;
  slug: string;
  description?: string | null;
  cover?: string | null; // asset_id
  language?: string; // ISO-639-1, defaults to 'en'
  created_at?: Date;
  updated_at?: Date | null;
};

export function validateProgramCreate(raw: ProgramCreateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(raw.id)) issues.push({ field: 'id', message: 'must be a UUID' });

  if (!isNonEmpty(raw.title)) {
    issues.push({ field: 'title', message: 'must be non-empty' });
  } else if (raw.title.trim().length < 10) {
    issues.push({ field: 'title', message: 'must be at least 10 characters' });
  } else if (raw.title.trim().length > 120) {
    issues.push({ field: 'title', message: 'must be 120 characters or less' });
  }

  if (!isEnumValue(ProgramType, raw.type)) {
    issues.push({ field: 'type', message: 'must be a valid ProgramType' });
  }

  if (!isValidSlug(raw.slug)) {
    issues.push({ field: 'slug', message: 'must be a valid slug (lowercase letters, numbers, hyphens only, max 80 chars)' });
  }

  // Optional description validation
  if (raw.description !== undefined && raw.description !== null && typeof raw.description === 'string' && raw.description.trim().length > 5000) {
    issues.push({ field: 'description', message: 'must be 5000 characters or less' });
  }

  // Optional cover validation - should be a valid asset_id (assuming UUID format for now)
  if (raw.cover !== undefined && raw.cover !== null && typeof raw.cover === 'string' && !isUuid(raw.cover)) {
    issues.push({ field: 'cover', message: 'must be a valid asset ID (UUID)' });
  }

  // Language validation with default
  const language = raw.language || 'en';
  if (!isValidLanguageCode(language)) {
    issues.push({ field: 'language', message: 'must be a valid ISO-639-1 language code' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    id: raw.id,
    title: raw.title.trim(),
    type: raw.type,
    slug: raw.slug.trim(),
    description: raw.description?.trim() || null,
    cover: raw.cover || null,
    language: language,
    status: ProgramStatus.DRAFT, // Always set to draft for new programs
    published_at: null, // Always null for new programs
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  } as const;
}
