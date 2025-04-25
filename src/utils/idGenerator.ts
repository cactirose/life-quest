
/**
 * Generates a unique ID string suitable for use as entity identifiers.
 * This is a simplified version that produces UUID-like strings.
 * Replace with a proper UUID library if needed for production.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
}

/**
 * Generates a v4 UUID-like string
 * This is a simplified implementation; consider using a proper UUID library
 * for production applications requiring standards-compliant UUIDs
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Converts a non-UUID ID to a UUID format
 * Used for data migrations when changing ID formats
 */
export function migrateToUUID(oldId: string): string {
  // If it's already a UUID, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(oldId)) {
    return oldId;
  }
  
  // Create a deterministic UUID based on the old ID
  const hash = Array.from(oldId).reduce((acc, char) => {
    return (((acc << 5) - acc) + char.charCodeAt(0)) | 0;
  }, 0);
  
  // Use the hash to create a deterministic part of the UUID
  const deterministicPart = Math.abs(hash).toString(16).padStart(8, '0');
  
  // Generate the rest randomly
  return `${deterministicPart.substring(0, 8)}-${deterministicPart.substring(0, 4)}-4${generateUUID().substring(14)}`;
}
