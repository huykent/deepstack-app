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

// Define the URL and password directly in the code
const DEEPSTACK_URL = 'http://192.168.0.23:5000';  // Update this with your DeepStack URL
const PASSWORD = 'yourpassword';  // Update this with your password

// Handle password check
app.post('/check-password', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});
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
        const { name } = req.body;
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));
        form.append('name', name);

        const response = await axios.post(`${DEEPSTACK_URL}/face/add`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Remove file after upload

        res.json({ success: response.data.success });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Handle face recognition
app.post('/recognize-face', upload.single('image'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));

        const response = await axios.post(`${DEEPSTACK_URL}/face/recognize`, form, {
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

        const response = await axios.post(`${DEEPSTACK_URL}/licenseplate`, form, {
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

        const response = await axios.post(`${DEEPSTACK_URL}/ocr`, form, {
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
