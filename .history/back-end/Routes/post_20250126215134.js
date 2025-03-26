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
router.post('/edit-post',upload.any(),post.edit_post)
router.post('/delete-file-post',post.delete_file_post)
router.get('/get-sizes-file/:id',post.get_file_size)
router.get('/data-comment/:id',post.data_comment)

module.exports = router