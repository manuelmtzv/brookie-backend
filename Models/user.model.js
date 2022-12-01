import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
import validator from "validator";

import { parseError } from "../utilities/utilityMethods.js";
import { parse } from "dotenv";

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true
  }, 
  username: {
    type: String, 
    required: true, 
    unique: true, 
    minLenght: [6, "Too short"], 
    maxLenght: [18, "Too long"]
  },
  password: {
    type: String, 
    required: true, 
    minLenght: [8, "Too short"], 
    maxLenght: [40, "Too long"]
  }
})

// Login
userSchema.statics.login = async function (identifier, password) {
  if (!identifier || !password) {
    throw Error(parseError({ error: "All fields must be filled", type: "WARNING" })); 
  }

  const userByEmail = await this.findOne({ email: identifier });
  const userByUsername = await this.findOne({ username: identifier }); 

  const user = userByEmail ? userByEmail : userByUsername; 

  if (!user) {
    throw Error(parseError({ error: "Incorrect username or email", type: "CRITICAL" })); 
  }

  const match = await bcrypt.compare(password, user.password);

  if(!match) {
    throw Error(parseError({ error: "Incorrect password", type: "CRITICAL" })); 
  }

  return user; 
}

// Signup
userSchema.statics.signup = async function (email, username, password) {

  const existsEmail = await this.findOne({email}); 
  const existsUsername = await this.findOne({username});   

  // Validate unique values
  if (existsEmail) {
    throw Error(parseError({ error: "This email is already in use", type: "WARNING" })); 
  } else if (existsUsername) {
    throw Error(parseError({ error: "This username is already in use", type: "WARNING" })); 
  }
  
  // Validation of inputs
  if (!email || !username || !password) {
    throw Error(parseError({ error: "All fields must be filled", type: "WARNING" }))
  } else if (!validator.isEmail(email)) {
    throw Error(parseError({ error: "The email is not valid", type: "CRITICAL" }))
  } else if (!validator.isStrongPassword(password)) {
    throw Error(parseError({ error: "Password not strong enough", type: "CRITICAL" }))
  }    

  const salt = await bcrypt.genSalt(10); 
  const hash = await bcrypt.hash(password, salt); 

  const user = await this.create({email, username, password: hash}); 

  return user; 
}

const User = mongoose.model("User", userSchema); 

export default User;