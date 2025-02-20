const router = require('express').Router()
const post = require('../Controllers/post')
const path = require('path');
const upload = require('../Middleware/uploadFile')

router.post('/add-post',upload.any(),post.add_post)
router.get('/get-post/:id_classroom',post.get_post)
router.post('/add-comment',post.add_comment)
router.get('/get-comment/:id_classroom',post.get_comment)
router.get('/post/:id/:fileName',post.open_file)
router.get('/data-post/:id',post.data_post)

module.exports = router