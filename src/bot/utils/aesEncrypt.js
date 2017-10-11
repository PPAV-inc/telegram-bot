import crypto from 'crypto';

import config from '../../../env/bot.config';

const key = config.aesKey;

export default function aesEncrypt(data) {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'base64');
  crypted += cipher.final('base64');
  return crypted;
}
