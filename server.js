// Import các module cần thiết
const express = require('express');
const cors = require('cors'); // Cho phép truy cập từ các domain khác nhau

// Tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000; // Sử dụng port từ biến môi trường hoặc mặc định là 3000

// Middleware để xử lý JSON
app.use(express.json());

// Middleware để cho phép CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Định nghĩa các API endpoints
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.post('/api/data', (req, res) => {
  const receivedData = req.body;
  console.log('Dữ liệu nhận được:', receivedData);
  res.json({ message: 'Dữ liệu đã được nhận thành công!' });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên port ${port}`);
});