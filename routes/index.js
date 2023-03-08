var express = require('express');
var router = express.Router();
var WPAPI = require('wpapi');

var wp = new WPAPI({
  endpoint: 'http://webd3027.example.com/wp-json',
  username: 'sehwan',
  password: '1234qwer'
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await wp.posts();
  const user = await wp.users();
  const media = await wp.media().perPage(20);

  let posts = [];
  
  // console.log(media)
  // console.log(data[0].featured_media);
  
  data.forEach(item => {
    let authorName;
    user.forEach(user => {
      if(user.id === item.author){
        authorName = user.name
      }
    })

    let imageUrl;
    media.forEach(img => {
      if(img.id === item.featured_media){
        imageUrl = img.guid.rendered
      }
    })
    // console.log(authorName)

    posts.push(
      {
        title: item.title.rendered,
        excerpt: item.excerpt.rendered,
        author: authorName,
        imageUrl: imageUrl
      }
    );
  });
    
  res.render('index', { 
    title: 'The Wave', 
    posts:posts 
  });
});

module.exports = router;
