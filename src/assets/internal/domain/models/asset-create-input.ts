import { isUuid, isNonEmpty, DomainValidationError } from "../../../../shared/utilities/index.js";

export interface AssetCreateInput {
  id?: string;
  name: string;
  storage_key: string;
  extension: string;
  size: number;
  created_at?: Date;
  updated_at?: Date | null;
  last_access?: Date | null;
  is_available?: boolean;
}

export function validateAssetCreate(input: AssetCreateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  // Auto-generate ID if not provided
  const id = input.id || crypto.randomUUID();
  if (input.id && !isUuid(input.id)) {
    issues.push({ field: 'id', message: 'must be a valid UUID' });
  }

  // Validate name (required, 1-200 characters)
  if (!isNonEmpty(input.name)) {
    issues.push({ field: 'name', message: 'must be non-empty' });
  } else if (input.name.trim().length > 200) {
    issues.push({ field: 'name', message: 'must be 200 characters or less' });
  }

  // Validate storage_key (required)
  if (!isNonEmpty(input.storage_key)) {
    issues.push({ field: 'storage_key', message: 'must be non-empty' });
  }

  // Validate extension (required, lowercase alphanumeric, 1-10 chars)
  if (!isNonEmpty(input.extension)) {
    issues.push({ field: 'extension', message: 'must be non-empty' });
  } else if (!isValidExtension(input.extension)) {
    issues.push({ field: 'extension', message: 'must be lowercase alphanumeric and between 1-10 characters' });
  }

  // Validate size (required, integer >= 0)
  if (typeof input.size !== 'number' || !Number.isInteger(input.size) || input.size < 0) {
    issues.push({ field: 'size', message: 'must be a non-negative integer' });
  }

  if (issues.length > 0) {
    throw new DomainValidationError(issues);
  }

  return {
    id,
    name: input.name.trim(),
    storage_key: input.storage_key.trim(),
    extension: input.extension.toLowerCase().trim(),
    size: input.size,
    created_at: input.created_at || new Date(),
    updated_at: input.updated_at || null,
    last_access: input.last_access || null,
    is_available: input.is_available !== undefined ? input.is_available : true
  };
}

// Helper function to validate extension format
function isValidExtension(extension: string): boolean {
  if (typeof extension !== "string") return false;
  const regex = /^[a-z0-9]{1,10}$/;
  return regex.test(extension);
}
