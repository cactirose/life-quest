
import { toast } from "sonner";

/**
 * Try to perform a sync operation with automatic retries
 * @param operation The async operation to perform
 * @param operationName Name of the operation for logging
 * @param maxRetries Maximum number of retries (default: 3)
 * @param baseDelay Base delay between retries in ms (default: 1000)
 * @returns Promise resolving to true if successful, false if all retries failed
 */
export const retrySyncOperation = async (
  operation: () => Promise<any>, 
  operationName: string,
  maxRetries = 3,
  baseDelay = 1000
): Promise<boolean> => {
  let retries = 0;
  
  while (retries <= maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}/${maxRetries + 1} to sync ${operationName}`);
      await operation();
      console.log(`Successfully synced ${operationName}`);
      return true;
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        console.error(`Failed to sync ${operationName} after ${maxRetries + 1} attempts:`, error);
        return false;
      }
      
      console.warn(`Retrying ${operationName} sync in ${baseDelay * retries}ms...`);
      await new Promise(resolve => setTimeout(resolve, baseDelay * retries));
    }
  }
  
  return false;
};

/**
 * Validate that an entity has all required fields
 * @param entity The entity to validate
 * @param requiredFields Array of required field names
 * @returns True if valid, false otherwise
 */
export const validateEntity = (entity: any, requiredFields: string[]): boolean => {
  if (!entity) return false;
  
  for (const field of requiredFields) {
    if (entity[field] === undefined || entity[field] === null) {
      console.error(`Missing required field ${field} in entity:`, entity);
      return false;
    }
  }
  
  return true;
};

/**
 * Safely stringify an object, handling circular references
 */
export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (key && seenObjects.has(value)) return '[Circular]';
        seenObjects.add(value);
      }
      return value;
    });
  } catch (error) {
    return '[Object cannot be stringified]';
  } finally {
    seenObjects.clear();
  }
};

// Set to track objects for circular reference detection
const seenObjects = new Set();

/**
 * Safely execute an async function and provide detailed error information
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>, 
  errorMessage: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    toast.error(errorMessage);
    throw error;
  }
};
