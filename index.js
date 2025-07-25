// whatsapp-messenger/index.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp is ready to send messages.');
});

// Laravel will call this API
app.post('/send', (req, res) => {
    const { number, message } = req.body;
    const chatId = number + '@c.us';

    client.sendMessage(chatId, message)
        .then(() => res.send('✅ Message sent'))
        .catch(err => res.status(500).send('❌ Failed to send: ' + err));
});

client.initialize();
app.listen(3000, () => {
    console.log('🟢 Server running on http://localhost:3000');
});
