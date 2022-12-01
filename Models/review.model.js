import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true
  }, 
  book_name: {
    type: String, 
    required: true    
  }, 
  book_author: {
    type: String, 
    required: true
  }, 
  description: {
    type: String, 
    required: true
  }, 
  body: {
    type: String, 
    required: true
  }, 
  user_id: {
    type: String, 
    required: true
  },
  author: {
    type: String, 
    required: true
  }
}, {
  timestamps: true
})

const Review = mongoose.model("Review", reviewSchema); 

export default Review; 