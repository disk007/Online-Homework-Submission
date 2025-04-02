const router = require('express').Router()
const post = require('../Controllers/post')
const path = require('path');
const upload = require('../Middleware/uploadFile')
const token = require('../Middleware/token')

router.post('/add-post',token,upload.any(),post.add_post)
router.get('/get-post/:id_classroom',token,post.get_post)
router.post('/add-comment',token,post.add_comment)
router.get('/get-comment/:id_classroom',token,post.get_comment)
router.get('/post/:id/:fileName',post.open_file)
router.get('/data-post/:id',token,post.data_post)
router.post('/edit-post',token,upload.any(),post.edit_post)
router.post('/delete-file-post',token,post.delete_file_post)
router.get('/get-sizes-file/:id',post.get_file_size)
router.get('/data-comment/:id',token,post.data_comment)
router.post('/edit-comment',token,post.edit_comment)
router.post('/delete-post',token,post.delete_post)
router.post('/delete-comment',token,post.delete_comment)

module.exports = router