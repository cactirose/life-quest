
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
