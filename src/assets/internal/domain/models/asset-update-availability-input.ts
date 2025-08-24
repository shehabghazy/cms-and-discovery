import { isUuid, DomainValidationError } from "../../../../shared/utilities/index.js";

export interface AssetUpdateAvailabilityInput {
  id: string;
  is_available: boolean;
}

export function validateAssetUpdateAvailability(input: AssetUpdateAvailabilityInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(input.id)) {
    issues.push({ field: 'id', message: 'must be a valid UUID' });
  }

  if (typeof input.is_available !== "boolean") {
    issues.push({ field: 'is_available', message: 'must be a boolean' });
  }

  if (issues.length > 0) {
    throw new DomainValidationError(issues);
  }

  return { id: input.id, is_available: input.is_available };
}
