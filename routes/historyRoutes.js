const express = require('express');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
    const history = readJSONFile('history.json');
    res.json(history);
});
// router.post('/', (req, res) => {
//   const history = readJSONFile('history.json');
//   Object.assign(history, req.body);
//   writeJSONFile('history.json', history);
//   res.send('History added');
// });


router.put('/', (req, res) => {
    const history = readJSONFile('history.json');
    history.push(req.body); // Assuming req.body is the object to be added
    writeJSONFile('history.json', history);
    res.send('Object added to history');
})



module.exports = router;
