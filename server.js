const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const routers = require('./router/routes');

const app = express();
const { connection } = require('./src/userschema');

const MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4200', 'http://localhost:8000'],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(routers);

app.get('/getUser', (req, res) => {
  console.log('req', req.user.id);
  res.json({ uid: req.user.id }); // TO auth guard
});

// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
