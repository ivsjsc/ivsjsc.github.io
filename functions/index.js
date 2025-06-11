// functions/index.js
// Các module cần thiết từ Firebase Functions và Firebase Admin SDK
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Khởi tạo Firebase Admin SDK.
// SDK này được sử dụng để tương tác với các dịch vụ Firebase như Firestore từ backend.
// Trong môi trường Cloud Functions, admin SDK tự động được khởi tạo với quyền hạn đầy đủ.
admin.initializeApp();

// Lấy tham chiếu đến Firestore database
const db = admin.firestore();

/**
 * Cloud Function để xử lý yêu cầu HTTP POST cho form liên hệ.
 * Chức năng này sẽ nhận dữ liệu từ yêu cầu và lưu vào Firestore.
 *
 * @param {object} req - Đối tượng yêu cầu HTTP (request). Chứa thông tin về yêu cầu đến.
 * @param {object} res - Đối tượng phản hồi HTTP (response). Dùng để gửi phản hồi về client.
 */
exports.submitContactForm = functions.https.onRequest(async (req, res) => {
    // Để cho phép truy cập từ các nguồn khác (frontend của bạn),
    // chúng ta cần thiết lập CORS (Cross-Origin Resource Sharing).
    // Trong môi trường phát triển, có thể cho phép tất cả nguồn ('*').
    // Trong môi trường production, bạn nên giới hạn chỉ cho phép domain của bạn.
    res.set('Access-Control-Allow-Origin', '*'); // Hoặc cụ thể domain của bạn, ví dụ: 'https://ivsacademy.edu.vn'
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Xử lý preflight request (OPTIONS) từ trình duyệt.
    // Trình duyệt gửi request OPTIONS trước khi gửi request POST thực tế để kiểm tra CORS.
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // Đảm bảo đây là yêu cầu POST
    if (req.method !== 'POST') {
        // Nếu không phải POST, trả về lỗi 405 Method Not Allowed
        functions.logger.warn('Yêu cầu không hợp lệ: Không phải phương thức POST', { method: req.method });
        return res.status(405).send('Chỉ cho phép yêu cầu POST.');
    }

    // Lấy dữ liệu từ body của yêu cầu.
    // Dữ liệu được mong đợi ở định dạng JSON.
    const { name, email, phone, subject, message } = req.body;

    // Kiểm tra xem các trường bắt buộc có tồn tại không.
    if (!name || !email || !subject || !message) {
        // Nếu thiếu trường, trả về lỗi 400 Bad Request
        functions.logger.error('Thiếu thông tin form liên hệ', { body: req.body });
        return res.status(400).send('Vui lòng điền đầy đủ các trường bắt buộc: Họ và Tên, Email, Chủ đề, Nội dung.');
    }

    try {
        // Tạo một đối tượng dữ liệu để lưu vào Firestore.
        const formData = {
            name: name,
            email: email,
            phone: phone || null, // Điện thoại có thể rỗng
            subject: subject,
            message: message,
            timestamp: admin.firestore.FieldValue.serverTimestamp() // Thời gian server tạo bản ghi
        };

        // Thêm tài liệu mới vào bộ sưu tập 'contactMessages' trong Firestore.
        // addDoc sẽ tạo một ID tài liệu tự động.
        const docRef = await db.collection('contactMessages').add(formData);

        // Ghi log thành công
        functions.logger.info('Dữ liệu form liên hệ đã được lưu thành công!', { docId: docRef.id, formData: formData });

        // Gửi phản hồi thành công về client
        return res.status(200).json({
            status: 'success',
            message: 'Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ sớm liên hệ lại.',
            data: { id: docRef.id }
        });

    } catch (error) {
        // Ghi log lỗi nếu có vấn đề khi ghi vào Firestore
        functions.logger.error('Lỗi khi lưu dữ liệu form liên hệ vào Firestore:', error);
        // Gửi phản hồi lỗi về client
        return res.status(500).json({
            status: 'error',
            message: 'Đã xảy ra lỗi khi gửi yêu cầu của bạn. Vui lòng thử lại sau.'
        });
    }
});
