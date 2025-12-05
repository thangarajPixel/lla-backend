// Helper functions for admission ID encryption/decryption

/**
 * Encrypt admission ID to base64 format
 * Format: {id}_lla_{random} -> base64
 * Example: 141_lla_9921 -> MTQxX2xsYV85OTIx
 */
export function encryptAdmissionId(id: number): string {
  const random = Math.floor(Math.random() * 10000);
  const plainText = `${id}_lla_${random}`;
  return Buffer.from(plainText).toString('base64').replace(/=/g, '');
}

/**
 * Decrypt base64 encoded admission ID
 * Returns the numeric admission ID
 */
export function decryptAdmissionId(encryptedId: string): number | null {
  try {
    // Add padding if needed
    const padding = '='.repeat((4 - (encryptedId.length % 4)) % 4);
    const base64 = encryptedId + padding;
    
    // Decode from base64
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    
    // Extract ID from format: {id}_lla_{random}
    const match = decoded.match(/^(\d+)_lla_\d+$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    
    return null;
  } catch (error) {
    console.error('Error decrypting admission ID:', error);
    return null;
  }
}

/**
 * Example usage:
 * 
 * // Encrypt
 * const encrypted = encryptAdmissionId(141);
 * console.log(encrypted); // MTQxX2xsYV85OTIx
 * 
 * // Decrypt
 * const id = decryptAdmissionId('MTQxX2xsYV85OTIx');
 * console.log(id); // 141
 */
