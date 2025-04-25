import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID using UUID v4
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Migrate an old ID format to UUID format
 * Checks if the ID is already a UUID and returns it, otherwise generates a new one
 */
export const migrateToUUID = (oldId: string): string => {
  // UUID v4 regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // Check if the ID is already a valid UUID
  if (uuidPattern.test(oldId)) {
    return oldId;
  }
  
  // Otherwise generate a new UUID
  return generateId();
};

/**
 * Generate a unique numeric ID (legacy) 
 * This is kept for backwards compatibility
 */
export const generateNumericId = (): number => {
  return Math.floor(Math.random() * 1000000000);
};
