const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Secure password (store in environment variable)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hitpro9999';

// Middleware for parsing JSON and form data
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// API to check password
app.post('/check-password', (req, res) => {
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Handle file uploads and face assignment
app.post('/upload-face', upload.single('image'), (req, res) => {
    const name = req.body.name;

    if (!name || !req.file) {
        return res.status(400).json({ error: 'Missing name or image' });
    }

    // Rename the uploaded file
    const newFileName = `${name}_${Date.now()}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join('uploads', newFileName);

    fs.renameSync(req.file.path, newFilePath);

    // Save face information (this is just an example, you could store this in a database)
    const facesDB = './faces.json';
    const faces = fs.existsSync(facesDB) ? JSON.parse(fs.readFileSync(facesDB)) : [];
    faces.push({ name: name, imagePath: newFilePath });
    fs.writeFileSync(facesDB, JSON.stringify(faces, null, 2));

    res.json({ success: true, message: `Image for ${name} uploaded and saved successfully.` });
});

// Face recognition route
app.post('/recognize-face', upload.single('image'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const response = await axios.post(`${process.env.DEEPSTACK_URL || 'http://localhost:5000'}/v1/vision/face/recognize`, formData, {
            headers: formData.getHeaders()
        });

        // Match recognized faces with the database
        const facesDB = './faces.json';
        const faces = fs.existsSync(facesDB) ? JSON.parse(fs.readFileSync(facesDB)) : [];
        const recognized = response.data.predictions;

        const results = recognized.map(face => {
            const match = faces.find(f => f.name === face.userid);
            return match ? { ...face, name: match.name } : face;
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
