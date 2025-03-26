const router = require('express').Router()
const work = require('../Controllers/works')
const upload = require('../Middleware/uploadFile')

router.get('/detail-work/:user_id',work.detail_work)
router.get('/my-work/:user_id',work.my_work)
router.post('/send-work',upload.any(),work.send_work)
router.post('/cancel-work',work.cancel_work)
router.post('/delete-work',work.delete_work)
// router.get('/comxit/:id',work.xix)

module.exports = router