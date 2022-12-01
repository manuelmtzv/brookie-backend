import User from "../Models/user.model.js";
import jwt from "jsonwebtoken"

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// - Controllers -

// Login
const loginUser = async (req, res) => {
  const {identifier, password} = req.body; 

  try {
    const user = await User.login(identifier, password);

    // Create a token for the user
    const token = createToken(user._id); 

    res.status(200).json({ email: user.email, username: user.username, token }); 
  } catch (err) {
    res.status(400).json({error: err.message})
  }
}

// Signup
const signupUser = async (req, res) => {
  const {email, username, password} = req.body; 
  
  try {
    const user = await User.signup(email, username, password); 

    const token = createToken(user._id)

    res.status(200).json({email, username, token}); 
  } catch(err) {
    res.status(400).json({error: err.message}); 
  }
}

export default {
  loginUser, 
  signupUser
}