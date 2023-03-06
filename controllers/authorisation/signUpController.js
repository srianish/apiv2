const User = require("../../models/User")
const jwt = require('jsonwebtoken');
module.exports = async function SignUp(req, res){
  try {
    // Get the email, password, and role from the request body
    const { name, email, password, role } = req.body;

    // Check if a user with the same email already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).send('Email already in use');

   

    // Create a new user in the database
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Create a JWT using the `creatJwt` function
    const token = creatJwt(newUser);

    // Send the JWT in the response
    res.send({ token });
  } catch (err) {
    // If there is an error, return a 500 status code with the error message
    res.status(500).send(err.message);
  }
}

function creatJwt(user) {
  // Create a payload with the user's ID and role
  const payload = {
    id: user._id,
    role: user.role
  };

  // Sign the JWT with a secret key and an expiration time
  return jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
}