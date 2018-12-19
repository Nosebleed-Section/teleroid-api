const mongoose = require('mongoose')

const pictureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: Array
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: false
  },
  filename: {
    type: String,
    required: false
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Picture', pictureSchema)
