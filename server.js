const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyFaces = require('./verify');

const app = express();
const port = process.env.PORT || 3000;

// File upload setup
const upload = multer({ dest: 'uploads/' });

app.post('/verify', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
  try {
    const imagePath1 = req.files.image1[0].path;
    const imagePath2 = req.files.image2[0].path;

    const result = await verifyFaces(imagePath1, imagePath2);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Face verification API running at http://localhost:${port}`);
});
