const express = require('express');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
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
  const scheduleId = req.params.id;
  const updatedSchedule = req.body;
  const scheduleIndex = schedule.findIndex(item => item.id === scheduleId);
  if (scheduleIndex !== -1) {
    schedule[scheduleIndex] = {...schedule[scheduleIndex], ...updatedSchedule};
    writeJSONFile('schedule.json', schedule);
    res.json({ message: 'Schedule updated', schedule: schedule[scheduleIndex] });
  } else {
    res.status(404).send('Schedule not found');
  }
});

module.exports = router;
