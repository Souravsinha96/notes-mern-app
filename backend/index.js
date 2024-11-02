require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const app = express();
const PORT = process.env.PORT || 3500;

//connect to mongoDB
connectDB();

// custom middleware logger
app.use(logger);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/notes', require('./routes/api/notes'));
app.use('/tags', require('./routes/api/tags'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);
mongoose.connection.once('open', () => {
  console.log('connected to Mongo DB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
