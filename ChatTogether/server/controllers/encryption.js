const crypto = require('crypto');

// Mã hóa tin nhắn
function encryptMessage(publicKey, message) {
  const bufferMessage = Buffer.from(message, 'utf8');
  const encryptedMessage = crypto.publicEncrypt(publicKey, bufferMessage);
  return encryptedMessage.toString('base64');
}

// Giải mã tin nhắn
function decryptMessage(privateKey, encryptedMessage) {
  const bufferMessage = Buffer.from(encryptedMessage, 'base64');
  const decryptedMessage = crypto.privateDecrypt(privateKey, bufferMessage);
  return decryptedMessage.toString('utf8');
}

module.exports = { encryptMessage, decryptMessage };