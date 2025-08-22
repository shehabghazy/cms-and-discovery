/**
 * Common validation utilities for domain entities
 */

export const isUuid = (s: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export const isNonEmpty = (s: string): boolean => 
  typeof s === 'string' && s.trim().length > 0;

export const isValidSlug = (s: string): boolean => 
  typeof s === 'string' && 
  s.trim().length > 0 && 
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.trim()) &&
  s.trim().length <= 100;

export const isEnumValue = <T extends object>(e: T, v: unknown): v is T[keyof T] =>
  Object.values(e as any).includes(v as any);

export const asUrlOrNull = (s: string | null | undefined): string | null | undefined => {
  if (s == null || s === '') return null;
  try { 
    new URL(s); 
    return s; 
  } catch { 
    return undefined; 
  }
};

export const isDuration = (n: unknown): n is number =>
  typeof n === 'number' && Number.isInteger(n) && n >= 0;
