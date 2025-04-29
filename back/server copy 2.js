//
// The one with aws-sdk v3

// should update .env file to this
//
// AWS_ACCESS_KEY_ID=your-access-key
// AWS_SECRET_ACCESS_KEY=your-secret-key
// AWS_REGION=your-bucket-region
// AWS_BUCKET_NAME=your-bucket-name
// VITE_API_URL=http://localhost:3001


const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// AWS S3 setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

app.post('/uploadReceipt', async (req, res) => {
  const { userId } = req.body;

  // Find the local file based on userId
  const receiptPath = path.join(__dirname, 'receipts_folder', `${userId}.pdf`); 

  try {
    const fileBuffer = fs.readFileSync(receiptPath); // Read the file

    const fileName = `${Date.now()}_${userId}.pdf`; // Unique file name (timestamp + userId)

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `receipts/${userId}/${fileName}`,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    }));

    // Generate signed URL that expires in 14 days
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `receipts/${userId}/${fileName}`
      }),
      { expiresIn: 60 * 60 * 24 * 14 } // 14 days in seconds
    );

    res.json({ message: 'Receipt uploaded', url: signedUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload receipt', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
