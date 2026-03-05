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
        const { userid } = req.body;  // Retrieve userid from the form
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));
        form.append('userid', userid);  // Pass userid instead of name

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/face/register`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath);  // Remove file after upload

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

        const response = await axios.post(`${DEEPSTACK_URL}/v1/vision/face/recognize`, form, {
            headers: form.getHeaders(),
        });

        fs.unlinkSync(filePath); // Remove file after recognition

        let responseData = response.data;
        if (responseData.success && responseData.predictions && responseData.predictions.length > 0) {
            let bestPrediction = responseData.predictions[0];
            responseData = {
                ...responseData,
                userid: bestPrediction.userid,
                confidence: bestPrediction.confidence
            };
        }

        res.json(responseData);
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

        let responseData = response.data;
        if (responseData.success && responseData.predictions && responseData.predictions.length > 0) {
            // Assuming custom model returns 'label', 'plate', or it's implicitly the label
            let bestPrediction = responseData.predictions[0];
            responseData = {
                ...responseData,
                license_plate: bestPrediction.label || bestPrediction.plate || bestPrediction.userid,
                confidence: bestPrediction.confidence
            };
        }

        res.json(responseData);
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

        let responseData = response.data;
        if (responseData.success && responseData.predictions && responseData.predictions.length > 0) {
            // Usually OCR returns an array of predictions with 'text'
            // We can concatenate them or just return the first one
            let fullText = responseData.predictions.map(p => p.text).join(' ');
            responseData = {
                ...responseData,
                text: fullText
            };
        }

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
