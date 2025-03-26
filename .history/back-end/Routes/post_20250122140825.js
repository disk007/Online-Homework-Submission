const router = require('express').Router()
const post = require('../Controllers/post')
const path = require('path');
const upload = require('../Middleware/uploadFile')

router.post('/add-post',upload.any(),post.add_post)

module.exports = router