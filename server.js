const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user.model'); // Assuming you have a User model


const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
  'http://15.236.159.186',  // Your public IP address
  'http://localhost:4200',  // Your local development server
];
const usersFilePath = 'users.json';
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Functions
//************************************/
function writeJSONFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}
function getUserByEmail(email) {
  const users = readUsers();
  return users.find(user => user.email === email);
}

function addUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}
function readJSONFile(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    return "no json file";
  }
}

function getUserByEmail(email) {
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  return users.find(user => user.email === email);
}


// Endpoints
//************************************/

app.get('/api', (req, res) => {
    res.send('Hello, API!');
});

app.get('/api/example', (req, res) => {
    res.json({ message: 'This is an example endpoint' });
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (getUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };

  addUser(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid password' });
  }

  // Authentication successful
  res.status(200).json({ message: 'Login successful' });
});

app.get('/api/config', (req, res) => {
  const config = readJSONFile('config.json');
  res.json(config);
});

app.post('/api/config', (req, res) => {
  const config = readJSONFile('config.json');
  Object.assign(config, req.body);
  writeJSONFile('config.json', config);
  res.send("sucess");
  });

// Schedule endpoints
app.get('/api/schedule', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  res.json(schedule);
});

app.post('/api/schedule', (req, res) => {
  const schedule = readJSONFile('schedule.json');
  //schedule.push(req.body);
  Object.assign(schedule, req.body);
  writeJSONFile('schedule.json', schedule);
  res.send('Schedule added');
});

app.patch('/api/schedule/:id', (req, res) => {
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


app.get('/api/gallery', (req, res) => {
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

app.get('/api/gallery/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = `uploads/${imageName}`;
  res.sendFile(imagePath, { root: __dirname });
});

const port = 8008;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

