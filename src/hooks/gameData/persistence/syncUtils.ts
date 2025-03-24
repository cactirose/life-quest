
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';

const MAX_RETRY_ATTEMPTS = 3;

// Function to retry a failed sync operation
export const retrySyncOperation = async (operation: () => Promise<void>, fieldName: string): Promise<boolean> => {
  let attempts = 0;
  let success = false;
  
  while (attempts < MAX_RETRY_ATTEMPTS && !success) {
    attempts++;
    try {
      await operation();
      success = true;
    } catch (error) {
      console.error(`Attempt ${attempts} failed for ${fieldName}:`, error);
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts)));
    }
  }
  
  return success;
};

// Add validation helpers
export const validateEntity = (data: any, requiredFields: string[]): boolean => {
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
};

// Helper function to ensure user is authenticated
export const getUserData = async (): Promise<{ userId: string } | null> => {
  try {
    const sessionResult = await ensureValidSession();
    if (!sessionResult) return null;

    const userData = await supabase.auth.getUser();
    if (!userData.data || !userData.data.user) return null;

    return { userId: userData.data.user.id };
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
