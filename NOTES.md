# Notes

## Discuss How a Server Can Also Be a Client

![server as client diagram](https://git.generalassemb.ly/storage/user/3667/files/b31866b8-3a29-11e7-876b-f07dbfc7ea56)

## How To Deliver

You may be wondering:

- Which branch do I use?

- Why are there no planning issues for multer and node-s3-upload?

- Where do you even start?

### The Tutorial Branch is Your Guide

This talk is split up between a server and a client.

Start on the [tutorial branch of the express-multer-upload-api](https://git.generalassemb.ly/ga-wdi-boston/express-multer-upload-api/commits/tutorial)

- Is this self-contained?
  - No, there is a server repo and a client repo
  - With [upload client](https://git.generalassemb.ly/ga-wdi-boston/upload-client/)
    , the tutorial branch is your guide.

### Branch Breakdown

The tutorial branch has the solution, and the training branch is consultants
working through the tutorial branch. A discussion for another day but…why not
just have master branch and solution and training branch? Don't worry about that
for now...

A `catch-up-along` is a great way to present this lesson, as it reinforces good
commit messages and usefulness of commits.

Branch Breakdown:

- `Solution` was created to be a single commit branch of the solution.
- `Tutorial` was created to be a commit by commit branch of the solution.
- `<cohort>/training` is used live in class as you’re delivering especially in
  case it spans multiple days and you need to have a developer just fetch your
  branch because they got so lost.  So technically the training branches could
  be deleted but its kinda nice to see.

### :dolphin: Delivery Advice

I like to do them as a `catch-up-along` not a standard `code-along`.  I will
write comments for what I’m going to write, then I will write it, then I do a
commit and I have them “catch up” where I leave my code and the commit on the
screen so they can catch up to that point.

I post the commit message in slack and have them :white_check_mark: when they
“catch up” and then I move on to the next step.

I have only done multer a few times but I find it similar to `ember-resources`
in that you’re building a full feature with them.

### :nyancat: Delivery Advice

from [delivery issue](https://git.generalassemb.ly/ga-wdi-boston/node-s3-upload/issues/13)

2.5 units. I basically did a long code-along, introducing the concepts of file
uploads and readable streams and buffers along the way. Made use of the two
videos in #10

Towards the end of the command line upload lesson, I gave the developers ~ 30
minutes to do:

- avoiding filename collisions (incorporating uuid or today's date in the file /
  folder name)
- working on index.html and posting to an echo server (we will use this to test
  our multi-part form uploader) [example index.html and index.js with echo server](https://git.generalassemb.ly/ga-wdi-boston/node-s3-upload/tree/pvd-03/training/public)

This talk is going to lead into express-multer-api-upload where I will start
from a fresh copy of express-api-template and pull in this finalized script that
is available in pvd-02/solution.

We can use the script the same as it's used in the command line upload to make
sure all dependencies and everything are loaded in. Then we can actually
incorporate routes

Once we verify the command line script is working, I gave devs 30 minutes to do
a "lab": make a route to GET all uploads.

Next is using multer and making a POST for a new upload. [here](https://git.generalassemb.ly/ga-wdi-boston/express-multer-upload-api/blob/tutorial/app/controllers/uploads.js)
is the completed controller with CRUD actions in a controller file as opposed to
a routes file.

Towards the end of express-multer-api-upload, we can build / incorporate an
upload form, like [this one](https://github.com/zishon89us/node-cheat/tree/master/aws/express_multer_s3).
