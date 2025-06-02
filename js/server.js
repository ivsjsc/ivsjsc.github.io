require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.error('Lỗi: Khóa API Gemini không được tìm thấy trong biến môi trường. Vui lòng đặt GEMINI_API_KEY trong tệp .env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

app.get('/', async (req, res) => {
    try {
        const headerContent = await fs.readFile(path.join(__dirname, 'public', 'header.html'), 'utf8');
        
        const html = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>IVS JSC - Kết nối Giáo dục Toàn cầu</title>
            </head>
            <body class="bg-neutral-900 text-white">
                ${headerContent}
                <main class="container mx-auto px-4 py-8">
                    <h1 class="text-3xl font-bold text-center">Chào mừng đến với IVS JSC</h1>
                    <p class="text-center mt-4">Kết nối Giáo dục Toàn cầu – Chính xác, Hiệu quả, Chiến lược, Hữu ích.</p>
                </main>
            </body>
            </html>
        `;
        res.send(html);
    } catch (err) {
        console.error('Error reading header file:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tin nhắn.' });
    }

    try {
        const result = await model.generateContent([message]);
        const responseText = result.response.candidates[0].content.parts[0].text;
        res.json({ response: responseText });
    } catch (error) {
        console.error('Lỗi khi tạo phản hồi từ Gemini API:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.' });
    }
});

app.listen(port, () => {
    console.log(`IVS JSC server running at http://localhost:${port}`);
    console.log('IVS – Tư duy chiến lược, Hành động thực tiễn, Giá trị toàn cầu.');
});
