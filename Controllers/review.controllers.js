import Review from "../Models/review.model.js";
import User from "../Models/user.model.js";
import { Types } from "mongoose";
import { parseError } from "../utilities/utilityMethods.js";

const get = async (req, res) => {
  try {
    const review = await Review.find(); 
    res.status(200).send(review); 
  } catch(err) { 
    console.log(err); 
  }
}

const getById = async (req, res) => {
  const id = req.params.id; 

  try {
    const review = await Review.findById(id); 
    res.status(200).send(review); 
  } catch(err) {
    res.status(400).json({
       error: parseError({ 
        title: "404 - Review Not Found",
        error: "The review you were looking for does not exist. It might have been removed, had its route changed or is temporaly unavailable." 
      }) 
    }); 
  }
}

const getUserReviews = async (req, res) => {
  const _id = req.user; 

  try {
    const review = await Review.find({ user_id: new Types.ObjectId(_id) }); 
    res.status(200).send(review); 
  } catch(err) { 
    res.status(400).json({error: err.message}); 
  }
}

const createReview = async (req, res) => {  
  const _id = req.user; 
  const { title, book_name, book_author, description, body } = req.body; 

  let emptyFields = []

  if (!title) {
    emptyFields.push("title"); 
  }
  if (!book_name) {
    emptyFields.push("book_name"); 
  }
  if (!book_author) {
    emptyFields.push("book_author"); 
  }
  if (!description) {
    emptyFields.push("description")
  }
  if (!body) {
    emptyFields.push("body")
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ 
      error: parseError({ 
        error: `Please fill in all the fields: ${emptyFields.map(field => {
          return " " + field
        })}`, type: "WARNING" 
      }) 
    })
  }

  const user = await User.findOne({ _id })  

  const review_body = { title, book_name, book_author, description, body, user_id: new Types.ObjectId(_id), author: user.username }

  try {
    const review = new Review(review_body); 
    const result = await review.save(); 

    res.status(201).send(result); 
  } catch(err) {
    res.status(400).json({error: err.message}); 
  }
}

const deleteById = async (req, res) => {
  const id = req.params.id; 

  try {
    const result = await Review.findByIdAndDelete(id); 
    console.log(result); 
    res.status(200).send(result); 
  } catch(err) {
    res.status(400).json({error: err.message}); 
  }
}

export default {
  get, 
  getUserReviews,
  getById, 
  createReview, 
  deleteById
}