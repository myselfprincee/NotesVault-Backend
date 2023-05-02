const mongoose = require('mongoose');

// const connectToMongo = require('../db')

const NotesSchema = new Schema({
  Title: {
    type: String,
    required: true
  },
  Content: {
    type: String,
    required: true,
    unique: true
  },

  tag: {
    type: String,
  }, 
  Date : {
    type: Date,
    default: Date.now
  }


});

module.exports = mongoose.model('notes', NotesSchema);