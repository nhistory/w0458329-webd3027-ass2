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
    categories.push(item.name)
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


  res.redirect('/');
});

module.exports = router;
