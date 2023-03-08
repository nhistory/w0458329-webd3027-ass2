var express = require('express');
var multer = require('multer');
var WPAPI = require('wpapi');

var storage = multer.memoryStorage();;
var upload = multer({storage: storage});

var router = express.Router();

var wp = new WPAPI({
  endpoint: 'http://webd3027.example.com/wp-json',
  username: 'Jenn Lee',
  password: '1234qwer'
});

/* GET Post Form. */
router.get('/', async function(req, res, next) {
  const category = await wp.categories()
  // console.log(category)

  let categories = [];

  category.forEach(item => {
    if(item.name !== 'Uncategorized')
    categories.push({
      id:item.id,
      name:item.name
    })
  })
  // console.log(categories)

  res.render('create', {
    title: 'New Post',
    categories: categories
  });
});

/* POST submitted */
router.post('/', upload.single('featured_image'), function(req, res, next){
  console.log(req.file.buffer);
  console.log(req.body);

  let associatedPostId ="";

  // Create post by using wpAPI
  wp.posts().create({
      // "title" and "content" are the only required properties
      title: req.body.title,
      content: req.body.content,
      categories: req.body.category,
      // Post will be created as a draft by default if a specific "status"
      // is not specified
      status: 'publish'
  }).then(function( response ) {
      // "response" will hold all properties of your newly-created post,
      // including the unique `id` the post was assigned on creation
      console.log( response.id );
      associatedPostId = response.id;
  }).catch(function(err){
      //handle error
      console.log(err);
  })

  wp.media()
      // Specify a path to the file you want to upload, or a Buffer
      .file(req.file.buffer, req.file.originalname)
      .create({
          title: `${req.body.title}_image`,
          alt_text: `${req.body.title}_image`,
          caption: req.body.title,
          description: `${req.body.title}_image`
      })
      .then(function( response ) {
          // Your media is now uploaded: let's associate it with a post
          var newImageId = response.id;
          return wp.posts().id( associatedPostId ).update({
              featured_media: newImageId
          });
      })
      .then(function( response ) {
          console.log( 'Media ID #' + response.id );
          console.log( 'is now associated with Post ID #' + response.post );
      }).then(()=>{
        res.redirect('/');
      });
});

module.exports = router;
