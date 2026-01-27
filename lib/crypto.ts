/**
 * OTP (One-Time Pad) symmetric encryption using XOR
 * Uses the politician's name as the key combined with a random salt for enhanced security
 */

/**
 * Generates a random 6-character hex salt (3 bytes)
 * @returns 6-character hex string representing 3 random bytes
 */
export function generateSalt(): string {
  const saltBytes = new Uint8Array(3);
  crypto.getRandomValues(saltBytes);
  return Array.from(saltBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Helper to compute SHA-256 hash of a string
 */
async function sha256(text: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

/**
 * Encrypts a number using OTP with the given key and salt
 * @param number - The number to encrypt
 * @param key - The key string (politician name)
 * @param salt - Optional 6-character hex salt (if not provided, generates new one)
 * @returns Object containing salt and hash separately
 */
export async function otpEncrypt(
  number: number,
  key: string,
  salt?: string,
): Promise<{ salt: string; hash: string }> {
  // Generate salt if not provided
  const saltHex = salt || generateSalt();

  // 1. Make the number to be binary format (3 bytes to match salt/hash length)
  const numberBytes = new Uint8Array(3);
  // Store in Big Endian
  numberBytes[0] = (number >> 16) & 0xff;
  numberBytes[1] = (number >> 8) & 0xff;
  numberBytes[2] = number & 0xff;

  // 2. Derive mask from key + salt using SHA-256
  // This ensures even a small change in key/salt produces a completely different mask
  const mask = await sha256(key + saltHex);

  // 3. OTP (hash = number ^ mask)
  // We only need 3 bytes for the hash, so we use the first 3 bytes of the SHA-256 hash
  const hashBytes = new Uint8Array(3);
  for (let i = 0; i < 3; i++) {
    hashBytes[i] = numberBytes[i] ^ mask[i];
  }

  // 4. The outcome will be called 'hash' (convert to hex string)
  const hashHex = Array.from(hashBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    salt: saltHex,
    hash: hashHex,
  };
}

/**
 * Decrypts a hash using OTP with the given key and salt
 * @param hash - 6-character hex string (the encrypted ciphertext)
 * @param key - The key string (politician name)
 * @param salt - 6-character hex salt (must match the salt used during encryption)
 * @returns The decrypted number (0-16,777,215) or null if invalid format
 */
export async function otpDecrypt(
  hash: string,
  key: string,
  salt: string,
): Promise<number | null> {
  // Validate lengths
  if (hash.length !== 6 || salt.length !== 6) {
    return null;
  }

  // 1. Get hash in binary format
  const hashBytes = new Uint8Array(3);
  for (let i = 0; i < 3; i++) {
    const h = parseInt(hash.slice(i * 2, i * 2 + 2), 16);
    if (isNaN(h)) return null;
    hashBytes[i] = h;
  }

  // 2. Derive mask from key + salt using SHA-256
  const mask = await sha256(key + salt);

  // 3. OTP (number = hash ^ mask)
  const numberBytes = new Uint8Array(3);
  for (let i = 0; i < 3; i++) {
    numberBytes[i] = hashBytes[i] ^ mask[i];
  }

  // 4. Turn it into the decimal number
  // Reconstruct from Big Endian
  const number =
    (numberBytes[0] << 16) | (numberBytes[1] << 8) | numberBytes[2];

  // Note: We removed the range check (0-500).
  // If the key is wrong, the mask will be completely different,
  // resulting in a random number roughly uniformly distributed between 0 and 16,777,215.

  return number;
}
