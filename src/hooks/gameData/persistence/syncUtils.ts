
import { supabase } from "@/integrations/supabase/client";

// Function to retry sync operations with exponential backoff
export const retrySyncOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries = 3
): Promise<boolean> => {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await operation();
      return true;
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} for ${operationName} failed:`, error);
      
      if (retryCount >= maxRetries) {
        console.error(`All ${maxRetries} attempts for ${operationName} failed.`);
        return false;
      }
      
      // Exponential backoff: 100ms, 200ms, 400ms, etc.
      const backoffTime = Math.pow(2, retryCount) * 100;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  return false;
};

// Validate if an entity has all required fields
export const validateEntity = (entity: any, requiredFields: string[]): boolean => {
  if (!entity) return false;
  
  for (const field of requiredFields) {
    if (entity[field] === undefined || entity[field] === null) {
      return false;
    }
  }
  
  return true;
};

// Safely check for valid user session
export const ensureValidSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error checking session:", error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Failed to check session:", error);
    return false;
  }
};

// Helper to safely stringify objects for error messages
export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      return value;
    }, 2);
  } catch (error) {
    return `[Unable to stringify: ${error}]`;
  }
};

// Wrapper to safely handle async operations
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMsg: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMsg, error);
    return fallback;
  }
};
