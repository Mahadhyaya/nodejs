
const Product = require('./schema')
const { Users, connection } = require('./userschema');
// const Users = Users;
// const connection = require('./userschema')
// const User = require('./userschema')
// const User = connection.model.Users
const bcrypt = require('bcrypt');


var getDataController = (req, res) => {
  console.log('Requested')
    Product.find({}).where({delete:false})
    .then((products) => {
      console.log('pro', products)
      
      // console.log('pro', products)
      res.status(201).json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('An error occurred while querying the database.');
    });
}

var createDataController = (req, res) => {
  const product = new Product(req.body);
  console.log(product, 'ps')
  product.save()
  .then((data) => {
    console.log('created')
    res.status(201).json(data);
  }, (err) => {
      console.log(err);
      res.status(500).send('An error occurred while saving the product to the database.');
      return;    
  })
}


var updateDataController = (req, res) => {
  const itemId = req.params.itemId;
  console.log(req.body, 'body');
  console.log('itemId', typeof itemId, itemId);
  // Product.findById()
  const data = req.body;
  Product.findByIdAndUpdate(itemId, {$set:data})
  .then(()=> {
    console.log('Item Updated')
    res.sendStatus(204);
  })
  .catch((eror) => {
    console.log('Error', eror);
    res.status(500).send('An Error Occured')
  })
}

var falseRemoveDataController = (req, res) => {
  const itemId = req.params.itemId;
  console.log('itemId', typeof itemId);
  // Product.findById()
  const data = req.body;
  console.log("data", data);
  Product.findByIdAndUpdate(itemId, {$set: data})
  .then(()=> {
    console.log('Item Deleted')
    res.send(204);
  })
  .catch((eror) => {
    console.log('Error', eror);
    res.status(500).send('An Error Occured')
  })
}

var registerUser =  (req, res) => {
  let { name, emailid, password } = req.body;

  
  if (!name || !emailid || !password) {
    console.log('hi')
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (!validateEmail(req.body.emailid)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  Users.findOne({ emailid: emailid })
    .then((user) => {
      if (user) {
        console.log('User already exists:', user);
        return res.status(200).json({ already: 'true' });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              console.log('Error hashing password:', err);
              res.status(500).send('An error occurred while hashing the password.');
            } else {
              password = hash;
              console.log(password)
              const newUser = new Users({ name, emailid, password });
              newUser.save()
                .then((data) => {
                  console.log('User registered:', data);
                  res.status(201).json({ already: 'false' });
                })
                .catch((error) => {
                  console.log('Error occurred while saving user:', error);
                  res.status(500).json({ error: 'An error occurred while saving the user.' });
                });
            }
          });
        });
      }
    })
    .catch((err) => {
      console.log('Error occurred while checking user:', err);
      res.status(500).json({ error: 'An error occurred while checking the user.' });
    });

};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


var loginUser = async (req, res) => {
  try {
    console.log('request');
    let { emailid, password } = req.body;
    console.log(req.body, 'body');
    console.log(emailid, 'email');

    const products = await Users.findOne({ 'emailid': emailid });
    
    if (products) {
      const hash = await bcrypt.hash(password, 10);
      console.log('hashed password', hash);

      if (await bcrypt.compare(password, products.password)) {
        res.status(200).json({ loggedin: 'true' });
      } else {
        res.status(400).send("Wrong Password");
      }
    } else {
      console.log('pro', products);
      res.status(201).send('User Already Registered Please Login');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An Error Occurred");
  }
};



module.exports = {falseRemoveDataController, updateDataController, createDataController, getDataController, registerUser, loginUser}