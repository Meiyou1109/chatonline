const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');
const fs = require('fs');
const { encryptMessage, decryptMessage } = require('./encryption.js');
const { hashMessage, checkIntegrity } = require('./hashing.js');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        const { fullName, username, password, phoneNumber } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(api_key, api_secret, app_id);

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                console.error('Có lỗi xảy ra:', err);
                return res.status(500).send({ error: 'Có lỗi xảy ra khi tạo khóa' });
            }

            // Lưu khóa công khai vào một file
    fs.writeFile('publicKey.pem', publicKey, (err) => {
        if (err) {
            console.error('Có lỗi xảy ra khi lưu khóa công khai:', err);
        }
    });

    // Lưu khóa riêng tư vào một file
    fs.writeFile('privateKey.pem', privateKey, (err) => {
        if (err) {
            console.error('Có lỗi xảy ra khi lưu khóa riêng tư:', err);
        }
    });
            res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber, message: 'Khóa đã được tạo thành công' });
        });

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(400).json({ message: 'User not found' });

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {ads
        console.log(error);

        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login }