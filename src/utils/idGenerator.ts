// Generate a UUID v4 compatible with Supabase UUID column type
export function generateId(): string {
  // Implementation of RFC4122 compliant UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to check if existing IDs need migration to UUID format
export function migrateToUUID(id: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // If it's already a valid UUID, return it
  if (uuidRegex.test(id)) {
    return id;
  }
  
  // Otherwise, generate a new UUID
  return generateId();
}
