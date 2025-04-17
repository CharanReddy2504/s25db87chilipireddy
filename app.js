// =======================================
//         Module Imports
// =======================================
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');
require('dotenv').config();

// =======================================
//         Initialize Express App
// =======================================
const app = express();

// =======================================
//         Database Connection
// =======================================
const connectionString = process.env.MONGO_CON;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// =======================================
//         View Engine Setup
// =======================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// =======================================
//         Middleware
// =======================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =======================================
//         Route Handlers
// =======================================
try {
  const indexRouter = require('./routes/index');
  const usersRouter = require('./routes/users');
  const resourceRouter = require('./routes/resource');
  const gridRouter = require('./routes/grid');
  const pickRouter = require('./routes/pick');
  const crystalRouter = require('./routes/crystal');

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/resource', resourceRouter);
  app.use('/grid', gridRouter);
  app.use('/selector', pickRouter);
  app.use('/crystal', crystalRouter); // ✅ This must be a router, not an object

} catch (err) {
  console.error('❌ Error loading one of the routers:', err.message);
}

// =======================================
//         404 Handler
// =======================================
app.use((req, res, next) => {
  console.warn('⚠️ 404 Not Found:', req.method, req.url);
  next(createError(404));
});

// =======================================
//         Error Handler
// =======================================
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
