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
const upload = multer({ storage }); // Uses memoryStorage to temporarily hold the file in memory (RAM), rather than saving it to disk.

//Receives the uploaded file (req.file) using multer.
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    //Streams the in-memory file directly to Cloudinary (no temp file saved on server).
    //Cloudinary then processes it and gives back a secure URL.
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Upload failed", error });
        }
        res.status(200).json({ message: "Upload successful", url: result.secure_url }); //Returns that Cloudinary link to the client.
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
