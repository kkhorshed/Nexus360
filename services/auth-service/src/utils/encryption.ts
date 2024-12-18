import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key-min-32-chars-long!!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ENCODING: BufferEncoding = 'base64';

interface EncryptedData {
  iv: string;
  tag: string;
  salt: string;
  content: string;
}

function getKey(salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
}

export function encrypt(text: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  const data: EncryptedData = {
    iv: iv.toString(ENCODING),
    tag: tag.toString(ENCODING),
    salt: salt.toString(ENCODING),
    content: encrypted.toString(ENCODING)
  };

  return JSON.stringify(data);
}

export function decrypt(encryptedData: string): string {
  const { iv, tag, salt, content } = JSON.parse(encryptedData) as EncryptedData;

  const key = getKey(Buffer.from(salt, ENCODING));
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, ENCODING)
  );

  decipher.setAuthTag(Buffer.from(tag, ENCODING));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, ENCODING)),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

// Test the encryption
function testEncryption() {
  const original = 'test-secret-value';
  const encrypted = encrypt(original);
  const decrypted = decrypt(encrypted);
  
  if (original !== decrypted) {
    throw new Error('Encryption test failed: decrypted value does not match original');
  }
}

// Run test when module loads
testEncryption();
