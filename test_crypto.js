import crypto from 'crypto';

const VAULT_SECRET = process.env.VAULT_SECRET || 'vault-secret-32-chars-long-key!!';
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(VAULT_SECRET, 'utf8').slice(0, 32), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

console.log(encrypt('test'));
