const router = require('express').Router()
const post = require('../Controllers/post')
const path = require('path');
const upload = require('../Middleware/uploadFile')

router.get('/add-post',post.add_post)

module.exports = router