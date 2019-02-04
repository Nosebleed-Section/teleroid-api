const express = require('express')
const passport = require('passport')

const Comment = require('../models/comment')
const Picture = require('../models/picture')
const User = require('../models/user')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// authentication middleware -- adds req.user, which it finds via token
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// index comments
router.get('/comments', (req, res) => {
  Comment.find()
    .then(comments => {
      return comments.map(comment => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(err => handle(err, res))
})

// show one comment
router.get('/comments/:id', (req, res) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => res.status(201).json(comment))
    .catch(err => handle(err, res))
})

// create a new comment
router.post('/comments', requireToken, (req, res) => {
  req.body.comment.owner = req.user.id

  Comment.create(req.body.comment)
    // get the username associated with the current user, and attach it to
    // the comment -- this will make it easy to display the username when we
    // show the comments
    .then(comment => {
      User.findById(comment.owner)
        .then(user => {
          comment.set({ username: user.username })
          comment.save()
        })
      return comment
    })
    .then(comment => {
      res.status(201).json({ comment: comment.toObject() })
      return comment
    })
    // trying to add a comment id reference to picture document
    .then(comment => {
      Picture.findById(comment.picture, function (err, picture) {
        if (err) { throw err }
        const array = picture.comments
        array.push(comment._id)
        picture.set({ comments: array })
        picture.save()
      })
    })
    .catch(err => handle(err, res))
})

// update one comment
router.patch('/comments/:id', requireToken, (req, res) => {
  delete req.body.comment.owner

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)

      // delete empty keys
      Object.keys(req.body.comment).forEach(key => {
        if (req.body.comment[key] === '') {
          delete req.body.comment[key]
        }
      })

      return comment.update(req.body.comment)
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

// delete a comment
router.delete('/comments/:id', requireToken, (req, res) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)
      // update the picture this comment was on;
      // remove this comment's id from picture.comments array
      Picture.findById(comment.picture, function (err, picture) {
        if (err) { throw err }
        const commentIndex = picture.comments.indexOf(comment._id)
        picture.comments.splice(commentIndex, 1)
        picture.save()
      })
      comment.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
