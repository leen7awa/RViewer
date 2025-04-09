const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config (memory storage for stream)
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Upload failed", error });
        }
        res.status(200).json({ message: "Upload successful", url: result.secure_url });
      }
    );

    Readable.from(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unexpected error', error: err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
