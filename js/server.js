const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (e.g., images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', async (req, res) => {
    try {
        // Read header.html
        const headerContent = await fs.readFile(path.join(__dirname, 'public', 'header.html'), 'utf8');
        
        // Construct the full HTML response
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

// Start the server
app.listen(port, () => {
    console.log(`IVS JSC server running at http://localhost:${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001; // You can choose a different port

app.use(cors());
app.use(bodyParser.json());

// Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI(process.env.AIzaSyBLCu4JTD0yWFyaC5c_O2RmL2YpcAcyODE);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'No message provided.' });
    }

    try {
        const result = await model.generateContent([message]);
        const response = result.response.candidates[0].content.parts[0].text;
        res.json({ response });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});