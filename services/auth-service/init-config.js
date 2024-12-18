const { Client } = require('pg');
const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'development-encryption-key-32-chars!!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ENCODING = 'base64';

function getKey(salt) {
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
}

function encrypt(text) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  const data = {
    iv: iv.toString(ENCODING),
    tag: tag.toString(ENCODING),
    salt: salt.toString(ENCODING),
    content: encrypted.toString(ENCODING)
  };

  return JSON.stringify(data);
}

async function initializeConfig() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    database: 'nexus360'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Initialize Azure AD config
    const configs = [
      {
        key: 'azure_ad_tenant_id',
        value: process.env.AZURE_AD_TENANT_ID,
        encrypted: false
      },
      {
        key: 'azure_ad_client_id',
        value: process.env.AZURE_AD_CLIENT_ID,
        encrypted: false
      },
      {
        key: 'azure_ad_client_secret',
        value: process.env.AZURE_AD_CLIENT_SECRET,
        encrypted: true
      }
    ];

    for (const config of configs) {
      const value = config.encrypted ? encrypt(config.value) : config.value;
      
      await client.query(
        `INSERT INTO app_config (key, value, encrypted)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE
         SET value = $2, encrypted = $3, updated_at = CURRENT_TIMESTAMP`,
        [config.key, value, config.encrypted]
      );

      console.log(`Config ${config.key} initialized successfully`);
    }

    console.log('All configurations initialized successfully');
  } catch (err) {
    console.error('Error initializing configurations:', err);
    throw err;
  } finally {
    await client.end();
  }
}

initializeConfig()
  .then(() => {
    console.log('Configuration initialization completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Configuration initialization failed:', err);
    process.exit(1);
  });
