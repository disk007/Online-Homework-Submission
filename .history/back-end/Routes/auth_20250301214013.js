const router = require('express').Router()
const authcontroller = require('../Controllers/auth')
const token = require('../Middleware/token')

router.post('/register-teacher', authcontroller.register_teacher)
router.post('/register-student', authcontroller.register_student)
router.post('/login', authcontroller.login)
router.get('/profile',token, authcontroller.profile)
router.post('/edit-profile',authcontroller.edit_profile)
router.post('/change-password',authcontroller.change_password)
router.post('/forgot-password',authcontroller.forgot_password)
router.get('/verifyTokenPass',authcontroller.verifyTokenPass)
router.post('/logout', authcontroller.logout)


module.exports = router;