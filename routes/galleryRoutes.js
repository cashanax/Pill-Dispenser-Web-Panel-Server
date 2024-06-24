const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
  router.delete('/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);

    // Check if the image exists
    if (fs.existsSync(imagePath)) {
      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          res.status(500).send('Error deleting image');
        } else {
          res.send('Image deleted successfully');
        }
      });
    } else {
      res.status(404).send('Image not found');
    }
  });
  router.post('/', upload.single('image'), (req, res) => {
    const imageFile = req.file; // multer adds the file object to the request

    if (!imageFile) {
        res.status(400).send('No file uploaded');
        return;
    }

    const imageFolder = 'uploads';

    // Check if the image folder exists, if not create it
    if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder);
    }

    const newPath = path.join(imageFolder, imageFile.originalname);

    // Move the uploaded image to the image folder
    fs.rename(imageFile.path, newPath, (err) => {
        if (err) {
            res.status(500).send('Error uploading image');
        } else {
            res.send('Image uploaded successfully');
        }
    });
});

module.exports = router;
