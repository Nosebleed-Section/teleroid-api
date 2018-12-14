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
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Picture', pictureSchema)
