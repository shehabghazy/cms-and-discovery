import { Language } from '../enums/index.js';
import { isUuid, isNonEmpty, isDuration, asUrlOrNull, isEnumValue, DomainValidationError } from '../../../shared/utilities/index.js';


export interface EpisodeMetadata {
  [key: string]: any;
}


export type EpisodeCreateInput = {
  id: string;
  program_id: string;
  title: string;
  description: string;
  language: Language;
  duration_s: number;
  source_url?: string | null;
  metadata?: EpisodeMetadata;
  published_at?: Date | null;
};


export type EpisodeUpdateInput = {
  title?: string;
  description?: string;
  language?: Language;
  duration_s?: number;
  source_url?: string | null;
  metadata?: EpisodeMetadata;
};


const cleanMetadata = (m?: EpisodeMetadata): EpisodeMetadata => {
  const src = (m && typeof m === 'object') ? m : {};
  const next: Record<string, unknown> = Object.create(null);
  for (const [k, v] of Object.entries(src)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (v === undefined) continue;
    next[k] = v;
  }
  return next;
};


export function validateEpisodeCreate(raw: EpisodeCreateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(raw.id)) issues.push({ field: 'id', message: 'must be a UUID' });
  if (!isUuid(raw.program_id)) issues.push({ field: 'program_id', message: 'must be a UUID' });

  if (!isNonEmpty(raw.title)) {
    issues.push({ field: 'title', message: 'must be non-empty' });
  } else if (raw.title.trim().length > 200) {
    issues.push({ field: 'title', message: 'must be 200 characters or less' });
  }

  if (!isNonEmpty(raw.description)) {
    issues.push({ field: 'description', message: 'must be non-empty' });
  } else if (raw.description.trim().length > 5000) {
    issues.push({ field: 'description', message: 'must be 5000 characters or less' });
  }

  if (!isEnumValue(Language, raw.language)) {
    issues.push({ field: 'language', message: 'must be a valid Language' });
  }

  if (!isDuration(raw.duration_s)) {
    issues.push({ field: 'duration_s', message: 'must be a non-negative integer (seconds)' });
  }

  const url = asUrlOrNull(raw.source_url ?? null);
  if (url === undefined) {
    issues.push({ field: 'source_url', message: 'must be a valid URL or null' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    id: raw.id,
    program_id: raw.program_id,
    title: raw.title.trim(),
    description: raw.description.trim(),
    language: raw.language,
    duration_s: raw.duration_s,
    published_at: raw.published_at ?? null,
    source_url: url ?? null,
    metadata: cleanMetadata(raw.metadata),
  } as const;
}


export function validateEpisodeUpdate(raw: EpisodeUpdateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  const out: EpisodeUpdateInput = {};

  if ('title' in raw && raw.title !== undefined) {
    if (!isNonEmpty(raw.title)) {
      issues.push({ field: 'title', message: 'must be non-empty' });
    } else if (raw.title.trim().length > 200) {
      issues.push({ field: 'title', message: 'must be 200 characters or less' });
    } else {
      out.title = raw.title.trim();
    }
  }

  if ('description' in raw && raw.description !== undefined) {
    if (!isNonEmpty(raw.description)) {
      issues.push({ field: 'description', message: 'must be non-empty' });
    } else if (raw.description.trim().length > 5000) {
      issues.push({ field: 'description', message: 'must be 5000 characters or less' });
    } else {
      out.description = raw.description.trim();
    }
  }

  if ('language' in raw && raw.language !== undefined) {
    if (!isEnumValue(Language, raw.language)) {
      issues.push({ field: 'language', message: 'must be a valid Language' });
    } else {
      out.language = raw.language;
    }
  }

  if ('duration_s' in raw && raw.duration_s !== undefined) {
    if (!isDuration(raw.duration_s)) {
      issues.push({ field: 'duration_s', message: 'must be a non-negative integer (seconds)' });
    } else {
      out.duration_s = raw.duration_s;
    }
  }

  if ('source_url' in raw) {
    const url = asUrlOrNull(raw.source_url ?? null);
    if (url === undefined) {
      issues.push({ field: 'source_url', message: 'must be a valid URL or null' });
    } else {
      out.source_url = url;
    }
  }

  if ('metadata' in raw && raw.metadata !== undefined) {
    out.metadata = cleanMetadata(raw.metadata);
  }

  if (issues.length) throw new DomainValidationError(issues);

  return out;
}
