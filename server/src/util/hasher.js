const crypto = require('crypto');

export function hashPassword(password, salt) {
  const hmac = crypto.createHmac('sha512', salt);
  hmac.update(password);
  return hmac.digest('hex');
}
