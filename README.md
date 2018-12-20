# Telaroid
~~Instagram~~ **Telaroid** is a free photo and video sharing app available on Apple iOS, Android and Windows Phone. People can upload photos or videos to our service and share them with their followers or with a select group of friends. They can also view, comment and like posts shared by their friends on ~~Instagram~~ Telaroid.

Our website, **Telaroid**, is a place where anyone can view photos and comments added by Telaroid users. If a user is signed in they can add, modify, view, and delete their own pictures and comments, and add comments to other's pictures.

##This is our extremely cool front end repo:

<https://github.com/Nosebleed-Section/teleroid-client>


##These are our deployed sites:

Front End: <https://nosebleed-section.github.io/teleroid-client/>

Back End: <https://intense-harbor-84312.herokuapp.com/>


##Technologies used:
  * Javascript
  * Mongo
  * Mongoose
  * Express
  * Amazon Web Service S3


##Unsolved problems:

On some images when adding a comment, the comment doesn't show up until you either refresh the page or upload another comment.

##Planning:

For planning, we spent time in the beginning clearly laying out MVP versus stretch goals. We layed out group roles. Shawn was the scrum master. Joel was in charge of the front-end and Xia was in charge of the back-end. But we made sure everyone was included in every step. We had a Trello board as well as a Google Doc to keep track of all of our features and goals. We spent a LOT of time pair programming. We had retrospectives everyday where we caught each other up on features we worked on and highlighted problems. We merged and pulled on our separate computers in a coordinated way to ensure we all had the current versions. When one of us had a problem, we would all come together to work on one computer and try and solve it. We could have been better at naming partners in our commits, and making sure everyone made a commit in each repo.


##ERD

Our back end has 3 tables, one for users, one for pictures, and one for comments. A user has many pictures and many comments. A picture has many comments and one owner. A comment has one picture and one user it is associated with.

<https://projects.invisionapp.com/freehand/document/nHiAdbpbV>


##Paths and Methods

Comments:
  * routes: app/routes/comment_routes.js
  * methods: app/models/comment.js
    - POST (to <https://intense-harbor-84312.herokuapp.com/comments>/)
    - PATCH (to <https://intense-harbor-84312.herokuapp.com/comments:{id}>/)
    - GET (to <https://intense-harbor-84312.herokuapp.com/comments>/) or (to <https://intense-harbor-84312.herokuapp.com/comments:{id}>/)
    - DELETE (to <https://intense-harbor-84312.herokuapp.com/comments>/)

Pictures:
  * routes: app/routes/picture_routes.js
  * methods: app/models/picture.js
    - POST (to <https://intense-harbor-84312.herokuapp.com/pictures>/ then AWS S3 Bucket)
    - PATCH (to <https://intense-harbor-84312.herokuapp.com/pictures:{id}>/ then AWS S3 Bucket)
    - GET (to <https://intense-harbor-84312.herokuapp.com/pictures>/ then AWS S3 Bucket) or (to <https://intense-harbor-84312.herokuapp.com/pictures:{id}>/ then AWS S3 Bucket)
    - DELETE (to <https://intense-harbor-84312.herokuapp.com/pictures>/ then AWS S3 Bucket)

Users:
  * routes: app/routes/user_routes.js
  * methods: app/models/user.js
    - POST (to <https://intense-harbor-84312.herokuapp.com/sign-up>/) and (to <https://intense-harbor-84312.herokuapp.com/sign-in>/)
    - PATCH (to <https://intense-harbor-84312.herokuapp.com/change-password>/)
    - DELETE (to <https://intense-harbor-84312.herokuapp.com/sign-out>/)
