const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:4200', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

// Function to write data to a JSON file
function writeJSONFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

// Function to read data from a JSON file
function readJSONFile(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    return "no json file";
  }

// config endpoints
}app.get('/config', (req, res) => {
  const config = readJSONFile('config.json');
  res.json(config);
});

app.post('/config', (req, res) => {
  const config = readJSONFile('config.json');
  Object.assign(config, req.body);
  writeJSONFile('config.json', config);
  res.send("sucess");
  });

// Schedule endpoints
app.get('/schedule', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  res.json(schedule);
});

app.post('/schedule', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  //schedule.push(req.body);
  Object.assign(schedule, req.body);
  writeJSONFile('schedule.json', schedule);
  res.send('Schedule added');
});

app.patch('/schedule/:id', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  const scheduleId = req.params.id;
  const updatedSchedule = req.body;

  // Find the index of the schedule with the given id
  const scheduleIndex = schedule.findIndex(item => item.id === scheduleId);
  
  // If the schedule is found, update it
  if (scheduleIndex !== -1) {
    schedule[scheduleIndex] = {...schedule[scheduleIndex], ...updatedSchedule};
    writeJSONFile('schedule.json', schedule);
    res.json({ message: 'Schedule updated', schedule: schedule[scheduleIndex] });
  } else {
    res.status(404).send('Schedule not found');
  }
});


app.get('/gallery', (req, res) => {
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
        return {
          name: image,
          modifiedDate: modifiedDate
        };
      });
      res.json(imageList);
    }
  });
});

app.get('/gallery/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = `uploads/${imageName}`;
  res.sendFile(imagePath, { root: __dirname });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
