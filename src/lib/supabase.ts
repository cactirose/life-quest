
// Re-export the supabase client from the main client file with hardcoded values for the client
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values instead of process.env
const supabaseUrl = 'https://ilfxfggmyrmblmrqjrvl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZnhmZ2dteXJtYmxtcnFqcnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzgzODIsImV4cCI6MjA1ODA1NDM4Mn0.LzUQ6MhDh3tG-L9X1J5oHNvXxcNAC1Fg-jNenCaDAhQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
