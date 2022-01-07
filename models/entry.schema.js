const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Cannot be blank'],
  },
  body: {
    type: String,
    required: [true, 'Cannot be blank'],
  },
  date: {
    type: Number
  },
  author: {
    type: String,
    required: [true, 'Cannot be blank']
  },
  tags: {
    type: Array
  }
});

module.exports = mongoose.model('entry', entrySchema);