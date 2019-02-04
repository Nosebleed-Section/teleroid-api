'use strict'
require('dotenv').config()

const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

const fs = require('fs')
const mime = require('mime-types')

// return a promise that is resolved or rejected
// based on if s3.upload succeeds or not
const s3Update = function (file, filename) {
  const bucketName = process.env.BUCKET_NAME

  // file path is from root of directory where file is run from
  const stream = fs.createReadStream(file)
  const questionIndex = filename.indexOf('?')
  let newFilename = filename.slice(0, questionIndex)
  const contentType = mime.lookup(newFilename)
  newFilename += `?t=${new Date().toISOString()}`

  const params = {
    // the bucket we upload it to
    Bucket: bucketName,
    Key: newFilename,
    // the actual file or contents of the file
    Body: stream,
    ContentType: contentType
  }

  return new Promise((resolve, reject) => {
    // upload file to s3
    s3.upload(params, function (err, data) {
      // if it fails then promise rejects
      if (err) {
        reject(err)
      // if it succeeds then promise resolves with data
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = s3Update
