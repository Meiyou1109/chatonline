const crypto = require('crypto');

// Hàm tạo giá trị băm cho một chuỗi
function hashMessage(message) {
    const hash = crypto.createHash('sha256');
    hash.update(message);
    return hash.digest('hex');
}

// Hàm kiểm tra tính toàn vẹn của tin nhắn
function checkIntegrity(sentHashValue, receivedMessage) {
    // Tạo giá trị băm cho tin nhắn đã nhận
    const receivedHashValue = hashMessage(receivedMessage);

    // So sánh hai giá trị băm
    if (sentHashValue === receivedHashValue) {
        console.log('Tin nhắn không bị thay đổi trong quá trình truyền.');
    } else {
        console.log('Tin nhắn đã bị thay đổi trong quá trình truyền.');
    }
}

module.exports = { hashMessage, checkIntegrity };