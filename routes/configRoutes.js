const express = require('express');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const router = express.Router();

router.get('/', (req, res) => {
  const config = readJSONFile('config.json');
  res.json(config);
});

router.post('/', (req, res) => {
  const config = readJSONFile('config.json');
  Object.assign(config, req.body);
  writeJSONFile('config.json', config);
  res.send("success");
});

module.exports = router;
