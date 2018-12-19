'use strict'
require('dotenv').config()

const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

// return a promise that is resolved or rejected
// based on if s3.delete succeeds or not
const s3Delete = function (filename) {
  const bucketName = process.env.BUCKET_NAME
  console.log('filename is ', filename)

  const params = {
    // the bucket we upload it to
    Bucket: bucketName,
    // the title of the image
    // Key: 'key.' + extension,
    Key: filename
  }

  return new Promise((resolve, reject) => {
    // upload file to s3
    s3.deleteObject(params, function (err, data) {
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

module.exports = s3Delete
