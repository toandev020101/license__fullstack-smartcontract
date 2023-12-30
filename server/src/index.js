require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// init database
require('./connectDB');

// init middlewares
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4000'], credentials: true }));
app.use(morgan('dev')); // log http request
app.use(helmet()); // privacy security
app.use(compression()); // reduce bandwidth
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const staticDir = path.join(__dirname, '../uploads');
app.use(
  '/uploads',
  express.static(staticDir, {
    setHeaders: (res, path) => {
      res.setHeader('Cross-Origin-Resource-Policy', '*'); // hoặc 'cross-origin'
    },
  }),
);

//init routes
app.use('', require('./routes'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`WSV start with port ${PORT}`);
});
