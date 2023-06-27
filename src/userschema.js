const mongoose = require('mongoose');
// const connection = mongoose.createConnection('mongodb+srv://mhsooryakumar8:sooryaMongo@cluster0.jjuymox.mongodb.net/product', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.createConnection('mongodb+srv://mhsooryakumar8:sooryaMongo@cluster0.jjuymox.mongodb.net/product', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});



const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailid: { type: String, required: true },
  password: { type: String, required: true },
});

const Users = connection.model('Users', UserSchema)
// module.exports = connection;
// module.exports = { Users, connection };
module.exports = { Users: Users, connection: connection };
// module.exports = mongoose.model('Users', UserSchema);
