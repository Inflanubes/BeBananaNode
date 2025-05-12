const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

// 🔁 Use memory buffer instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 * 1024 } // 20GB
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        chunk_size: 6000000
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary error:", error);
          return res.status(500).json({ error: 'Upload failed' });
        }
        console.log(`✅ Uploaded: ${result.original_filename}`);
        res.json({ secure_url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: 'Upload failed (server)' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server ready on port ${port}`);
});
