const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Read environment variables
const { DEEPSTACK_URL, PASSWORD } = process.env;

// Handle password check
app.post('/check-password', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Handle face upload
app.post('/upload-face', upload.single('image'), async (req, res) => {
    try {
        const { name, userid } = req.body;  // Lấy name và userid từ body
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        
        form.append('image', fs.createReadStream(filePath));  // Thêm ảnh vào form
        form.append('userid', userid);  // Thêm userid vào form

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/face/register`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Xóa tệp sau khi upload xong

        res.json({ success: response.data.success });  // Trả về kết quả thành công
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });  // Trả về lỗi nếu có
    }
});


// Handle face recognition
app.post('/recognize-face', upload.single('image'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/face/recognize`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Remove file after recognition

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Handle license plate recognition
app.post('/recognize-license', upload.single('image'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/custom/licence-plate`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Remove file after recognition

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Handle OCR recognition
app.post('/recognize-ocr', upload.single('image'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/ocr`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Remove file after recognition

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
