const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const imageFolder = 'uploads';
  fs.readdir(imageFolder, (err, files) => {
    if (err) {
      res.status(500).send('Error reading image folder');
    } else {
      const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
      const imageList = images.map(image => {
        const imagePath = `${imageFolder}/${image}`;
        const stats = fs.statSync(imagePath);
        const modifiedDate = stats.mtime;
        return { name: image, modifiedDate: modifiedDate };
      });
      res.json(imageList);
    }
  });
});

router.get('/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    res.sendFile(imagePath);
  });

router.post('/', (req, res) => {
    const imageFile = req.files.image;
    const imageFolder = 'uploads';

    // Check if the image folder exists, if not create it
    if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder);
    }

    // Move the uploaded image to the image folder
    imageFile.mv(`${imageFolder}/${imageFile.name}`, (err) => {
        if (err) {
            res.status(500).send('Error uploading image');
        } else {
            res.send('Image uploaded successfully');
        }
    });
});

module.exports = router;
