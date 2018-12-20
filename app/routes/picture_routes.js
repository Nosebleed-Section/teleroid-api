const express = require('express')
const passport = require('passport')

const Picture = require('../models/picture')
const Comment = require('../models/comment')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const multer = require('multer')
const picture = multer({ dest: 'pictures/' })

const s3Update = require('../../lib/aws-s3-update')
const s3Upload = require('../../lib/aws-s3-upload')
const s3Delete = require('../../lib/aws-s3-delete')

const router = express.Router()

router.get('/pictures', (req, res) => {
  Picture.find()
    .then(pictures => {
      return pictures.map(picture => picture.toObject())
    })
    .then(pictures => res.status(200).json({ pictures: pictures }))
    .catch(err => handle(err, res))
})

router.get('/pictures/:id', (req, res) => {
  Picture.findById(req.params.id)
    .then(handle404)
    .then(picture => res.status(200).json({ picture: picture.toObject() }))
    .catch(err => handle(err, res))
})

router.post('/pictures', [requireToken, picture.single('image')], (req, res) => {
  s3Upload(req.file.path, req.file.originalname, req.body.title)
    .then((response) => {
      // console.log(response.Location)
      // set owner of new upload to be current user
      // req.body.upload.owner = req.user.id
      return Picture.create({
        title: req.body.title,
        url: response.Location, // response.Location is the url sent back by Amazon AWS
        filename: response.Key, // response.Key is the title of the file on Amazon AWS
        owner: req.user.id,
        comments: []
      })
    })
    // respond with json
    .then((picture) => {
      res.status(201).json({ picture: picture.toObject() })
    })
})

router.patch('/pictures/:id', [requireToken, picture.single('image')], (req, res) => {
  Picture.findById(req.params.id)
    .then(handle404)
    .then(picture => {
      requireOwnership(req, picture)
      if (req.body.title) {
        picture.set({title: req.body.title})
      }
      console.log(picture)
      return picture.save()
    })
    .then(picture => {
      if (req.file) {
        s3Update(req.file.path, picture.filename)
      }
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

router.delete('/pictures/:id', requireToken, (req, res) => {
  Picture.findById(req.params.id)
    .then(handle404)
    .then(picture => {
      requireOwnership(req, picture)
      picture.comments.forEach(commentId => {
        Comment.findById(commentId)
          .then(comment => comment.remove())
      })
      s3Delete(picture.filename)
      picture.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
