const router = require('express').Router()
const works = require('../Controllers/works')
const upload = require('../Middleware/uploadFile')

router.get('/detail-work/:user_id',works.detail_work)
router.get('/my-work/:user_id',works.my_work)
router.post('/send-work',upload.any(),works.send_work)
router.post('/cancel-work',works.cancel_work)
router.post('/delete-work',works.delete_work)
router.post('/comment-work',works.comment_work)
router.post('/update-feedback',works.update_feedback)
router.get('/get-score/:id_assignment',works.get_score)

module.exports = router