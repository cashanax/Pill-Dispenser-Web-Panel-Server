const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./middleware/cors');
const indexRoutes = require('./routes/index');

const app = express();
app.use(bodyParser.json());
app.use(cors);

app.use('/api', indexRoutes);

const port = 8008;  
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
