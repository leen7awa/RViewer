
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const fs = require('fs');
const uploadPath = path.join(__dirname, 'upload');



if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // return cb(null, "./upload")
        return cb(null, "./upload")
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, "Hishbonit" + ext);
    }

})

const upload = multer({ storage })

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.post('/upload', upload.single('file'), (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ message: 'Upload failed', error });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
