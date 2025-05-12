const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

const upload = multer({ dest: 'uploads/', limits: { fileSize: 20 * 1024 * 1024 * 1024 } }); // 20GB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_large(req.file.path, {
      resource_type: 'image',
      chunk_size: 6000000
    });
    res.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server ready on port ${port}`);
});
