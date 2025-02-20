const router = require('express').Router()
const works = require('../Controllers/works')
const upload = require('../Middleware/uploadFile')

router.get('/detail-work/:user_id',works.detail_work)
router.get('/my-work/:user_id',works.my_work)
router.post('/send-work',upload.any(),works.send_work)
router.post('/cancel-work',works.cancel_work)
router.post('/delete-work',works.delete_work)
// router.get('/comxit/:id',works.xix)

module.exports = router