const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
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

// Shortens a URL using TinyURL, with fallback
async function getShortUrl(longUrl) {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    return response.data;
  } catch (err) {
    console.error("TinyURL failed, using original URL", err.message);
    return longUrl; // Fallback to long URL
  }
}

app.post('/uploadReceipt', async (req, res) => {
  const { userId } = req.body;
  const receiptPath = path.join(__dirname, 'receipts_folder', `${userId}.pdf`);

  try {
    const fileBuffer = fs.readFileSync(receiptPath);

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(2);
    const fileName = `${dd}${mm}${yy}_${userId}.pdf`;


    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: `receipts/${userId}`,
        public_id: fileName.replace('.pdf', '') // Cloudinary adds .pdf automatically if name ends with .pdf
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Upload failed", error });
        }

        const longUrl = result.secure_url;
        const shortUrl = await getShortUrl(longUrl);

        res.status(200).json({ message: "Upload successful", url: shortUrl });
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload receipt', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
