const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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

app.post('/uploadReceipt', async (req, res) => {
  const { userId } = req.body;

  // Find the receipt file
  const receiptPath = path.join(__dirname, 'receipts_folder', `${userId}.pdf`);

  try {
    const fileBuffer = fs.readFileSync(receiptPath); // Read the file

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: `receipts/${userId}` }, // Cloudinary treats PDFs as raw files
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Upload failed", error });
        }
        res.status(200).json({ message: "Upload successful", url: result.secure_url });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream); // Stream the buffer

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload receipt', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
