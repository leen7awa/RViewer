
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./upload")
    },
    filename: function (req, file, cb) {
        return cb(null, "Hishbonit.pdf")
    }
})

const upload = multer({ storage })

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.body)
//     console.log(req.file)
// })
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    console.log(req.file)
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
