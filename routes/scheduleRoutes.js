const express = require('express');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  res.json(schedule);
});

router.post('/', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  Object.assign(schedule, req.body);
  writeJSONFile('schedule.json', schedule);
  res.send('Schedule added');
});

router.patch('/:id', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  const scheduleIndex = parseInt(req.params.id, 10);
  const updatedSchedule = req.body;
  if (schedule[scheduleIndex]) {
    schedule[scheduleIndex] = {...schedule[scheduleIndex], ...updatedSchedule};
    writeJSONFile('schedule.json', schedule);
    res.json({ message: 'Schedule updated', schedule: schedule[scheduleIndex] });
  } else {
    res.status(404).send('Schedule not found');
  }
});

router.get('/first-two', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  const firstTwo = schedule.slice(0, 2);
  res.json(firstTwo);
});

module.exports = router;
