/**
 * OTP (One-Time Pad) symmetric encryption using XOR
 * Uses the politician's name as the key
 */

/**
 * Encrypts a number (0-500) using OTP with the given key
 * @param number - The number to encrypt (0-500)
 * @param key - The key string (politician name)
 * @returns 6-character hex string
 */
export function otpEncrypt(number: number, key: string): string {
  // Pad number to 3 digits: "7" → "007"
  const plaintext = number.toString().padStart(3, "0");

  // Convert plaintext and key to UTF-8 bytes
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);
  const keyBytes = encoder.encode(key);

  // XOR each plaintext byte with corresponding key byte
  const ciphertextBytes = new Uint8Array(plaintextBytes.length);
  for (let i = 0; i < plaintextBytes.length; i++) {
    ciphertextBytes[i] = plaintextBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Output as 6-character hex string
  return Array.from(ciphertextBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Decrypts a ciphertext using OTP with the given key
 * @param ciphertextHex - 6-character hex string
 * @param key - The key string (politician name)
 * @returns The decrypted number (0-500) or null if invalid
 */
export function otpDecrypt(ciphertextHex: string, key: string): number | null {
  // Validate hex length
  if (ciphertextHex.length !== 6) {
    return null;
  }

  // Parse hex to bytes
  const ciphertextBytes = new Uint8Array(3);
  for (let i = 0; i < 3; i++) {
    const hexPair = ciphertextHex.slice(i * 2, i * 2 + 2);
    const byte = parseInt(hexPair, 16);
    if (isNaN(byte)) {
      return null;
    }
    ciphertextBytes[i] = byte;
  }

  // Convert key to UTF-8 bytes
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key);

  // XOR with key bytes (same operation as encrypt)
  const plaintextBytes = new Uint8Array(ciphertextBytes.length);
  for (let i = 0; i < ciphertextBytes.length; i++) {
    plaintextBytes[i] = ciphertextBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Convert back to string
  const decoder = new TextDecoder();
  const plaintext = decoder.decode(plaintextBytes);

  // Validate that it's a valid number
  const number = parseInt(plaintext, 10);
  if (isNaN(number) || number < 0 || number > 500) {
    return null;
  }

  return number;
}
