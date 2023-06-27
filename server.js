const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
const routers = require('./router/routes')

const app = express();
const {connection} = require('./src/userschema')

// const connection = mongoose.createConnection('mongodb+srv://mhsooryakumar8:sooryaMongo@cluster0.jjuymox.mongodb.net/product', { useNewUrlParser: true, useUnifiedTopology: true });

const MongoStore = require('connect-mongo')(session)


const sessionStore = new MongoStore({ 
  mongooseConnection: connection,
  collection: 'sessions' 
});
  

app.use(
  session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
          maxAge: 1000 * 60 * 60 * 24 
      }
  })
);


app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(routers)

// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});



