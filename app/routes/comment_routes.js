const express = require('express')
const passport = require('passport')

const Comment = require('../models/comment')

const Picture = require('../models/picture')
const User = require('../models/user')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/comments', (req, res) => {
  Comment.find()
    .then(comments => {
      return comments.map(comment => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(err => handle(err, res))
})

router.get('/comments/:id', (req, res) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => res.status(201).json(comment))
    .catch(err => handle(err, res))
})

router.post('/comments', requireToken, (req, res) => {
  req.body.comment.owner = req.user.id

  Comment.create(req.body.comment)
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
        picture.set({comments: array})
        picture.save()
      })
    })
    .catch(err => handle(err, res))
})

router.patch('/comments/:id', requireToken, (req, res) => {
  delete req.body.comment.owner

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)

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

router.delete('/comments/:id', requireToken, (req, res) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)
      Picture.findById(comment.picture, function (err, picture) {
        if (err) { throw err }
        console.log('before splicing, picture.comments is', picture.comments)
        const commentIndex = picture.comments.indexOf(comment._id)
        picture.comments.splice(commentIndex, 1)
        console.log('after splicing, picture.comments is', picture.comments)
        picture.save()
      })
      comment.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
