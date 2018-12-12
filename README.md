[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Express Multer Upload API

In this lesson, we will learn how to perform a file upload to a remote server
using node, express, and Amazon Web Services (AWS).

## Prerequisites

- [An AWS (Amazon Web Services) account](https://git.generalassemb.ly/ga-wdi-boston/aws-s3-setup-guide)
- [ga-wdi-boston/express-api](https://git.generalassemb.ly/ga-wdi-boston/express-api)
- [ga-wdi-boston/node-api-promises](https://git.generalassemb.ly/ga-wdi-boston/node-api-promises)

## Objectives

By the end of this lesson, students should be able to:

- Upload files to AWS S3 from a node application
- Write files from a `Buffer` to the file-system.
- Create path names with a low chance of duplication
- Store information about uploaded files in MongoDB via Mongoose
- Upload files from a browser to express and store them in the file-system or
  AWS S3.

## Preparation

1. Fork and clone this repository.
 [FAQ](https://github.com/ga-wdi-boston/meta/wiki/ForkAndClone)
1. Create a new branch, `training`, for your work.
1. Checkout to the `training` branch.
1. Install dependencies with `npm install`.

## Discussion: Uploading Files

**Questions**

- What are the different steps of a file upload?
- What are the issues to guard against?
- How do we deal with a partial upload or a slow connection?

## AWS S3 Buckets

### Why Store Files In An AWS Bucket

AWS allows us to store files in a single source of truth accessible via the
internet, ie "the cloud". This means that files uploaded to S3 can be accessible
to all of your app users. Changes to your files can easily be seen by everyone.

The **bucket** abstraction specifically lets us store files in a folder in the
AWS cloud, as well as allow a specific and restrictive way of implementing
access control to that folder (a policy).

In the [ga-wdi-boston/aws-s3-setup-guide](https://git.generalassemb.ly/ga-wdi-boston/aws-s3-setup-guide)
prerequisite, you went through some steps to allow us access to read and write
to a bucket in the AWS S3 (storage <sup>cubed</sup>) service. The CSV
credentials that you downloaded at the end of that prereq is what will allow out
command line and server applications permission to upload files to your AWS S3
bucket.

### Code-Along: Uploading Files To AWS From `node`

We'll build a command line script to upload a file to your AWS bucket. We'll use
[AWS.S3](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html),
specifically the
[upload](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)
method, to send files to AWS S3.

#### Installing The `aws-sdk` Package

First, let's install the `aws-sdk` and another tool called `mime-types` for
this repo by running:

```bash
npm install --save aws-sdk mime-types
```

#### Writing Our Code

- First, let's set up a `.env` file in the root of our repo with:

```text
BUCKET_NAME=<your AWS bucket name>
ACCESS_KEY_ID=<access key id value from your credentials csv>
SECRET_ACCESS_KEY=<secret access key value from your credentials csv>
```

Let's create a file in `lib` called `aws-s3-upload.js` and start writing our
code in there.

The `lib/aws-s3-upload.js` script should be able to:

- take two command line arguments: the path to your file, and optionally, the
  name the file will have once uploaded to the s3 bucket
- upload a file to s3 using the `upload` method from the `AWS.S3` Object
- use a `Promise` to handle the asynchronous action of uploading `AWS.S3.upload`

#### Uploading A File To AWS With Our Script

Once we are done coding, we can run the script using this format:

```bash
BUCKET=<your bucket name> node lib/aws-s3-upload.js <file path> [file name]
```

For example, we could upload the image at `/data/images/padawan.png` by running:

```bash
BUCKET=chris-paynes-wdi-bucket node lib/aws-s3-upload.js /data/images/padawan.png uploadedImage
```

Once the script runs successfully, you can go to your Amazon S3 Bucket and see
that the file has been uploaded!

### Uploading Files To AWS Through A Server

#### Even A Server Can Be A Client Sometimes

One of the great utilities of being able to upload files to AWS from the command
line is that we can use this functionality within our servers to upload a user's
files to the cloud.

**Questions**

- What might this look like?
- How would we keep track of which files were uploaded by each user to the
  cloud, as well as their urls in the cloud?

Let's take a minute to draw it on the board.

![server client database s3 diagram](https://git.generalassemb.ly/storage/user/3667/files/b31866b8-3a29-11e7-876b-f07dbfc7ea56)

#### Building Our Server

This repo is already set up to run a standard `express-api`
server as you've seen in previous lessons.

In order to set up this server to upload files to s3, we will need to:

- Refactor our code from the last step so it can be imported as a
  module for our server
- Keep track of uploaded file information in a `mongo` database by:
  - Writing a  **model** for Upload data
  - Writing a **route** for Upload data

### Code-Along: Refactoring `lib/aws-s3-upload.js`

We will:

- Remove the parts of `/lib/aws-s3-upload.js` where the `Promise` is being run
  with `.then` and `.catch` methods
- Export this function using  `module.exports` so our server can use it

### Code-Along: Adding An `Upload` Model

We will:

- Make a file in `/app/models` called `upload.js`
- Describe our `Upload` schema in `/app/models/upload.js`:
  - Required keys: `title`, `url`, `owner` (reference key to `User`)

### Code-Along: Adding An `Upload` Route

We will:

- Make a copy of the contents of `/app/routes/example_routes.js` in a new file
  called `upload_routes.js` in `app/routes`
- Modify the appropriate imports and variable names to work with `Upload`
  request
- Add in `multer` functionality to allow data sent in requests to be stored on
  the server, then uploaded to s3 (run `npm install --save multer`)
- Add our route to `server.js`
- Add the logic to upload a file to S3 in the `POST` router

### Lab: Uploading Files To s3 Using `curl` Requests

Try and upload the image at `/data/images/padawan.png` to the server
using the `curl` scripts in `scripts/uploads`. Remember, our `upload` routes are
authenticated, so you'll need a token first.

> NOTE: use `/scripts/uploads/create-file.sh` to upload files. In order to send
a file using a `curl` request, you must specify the path to the image with a
`@` in front of it. For example:

  ```bash
  IMAGE_PATH=@./data/images/padawan.png ...
  ```

### BONUS Code-Along: Uploading Files Via A Browser Client

So far we have uploaded files directly to s3 using `node` scripts, as well as
via `curl` scripts sent to our custom server. In real world usage, we would most
likely be sending our data to the server via a browser client.

Follow the steps to set up this repo [ga-wdi-boston/upload-client](https://git.generalassemb.ly/ga-wdi-boston/upload-client/). 
Once it's set up, we can run it using `grunt serve` and try and use it to send
files to a server using HTML forms.

We will:

- Use a form with `action`, `method` and `enctype` HTML attributes to send
  files to an echo server [httpbin.org](http://httpbin.org), which if
  successful, will send the data back to us in response
- Modify the `action` attribute of our forms to send data to our custom server
  instead, which will then get uploaded to s3

## Additional Resources

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
