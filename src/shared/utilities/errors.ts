/**
 * Domain validation error class
 */
export class DomainValidationError extends Error {
  constructor(public readonly issues: Array<{ field: string; message: string }>) {
    super(issues.map(i => `${i.field}: ${i.message}`).join('; '));
    this.name = 'DomainValidationError';
  }
}
