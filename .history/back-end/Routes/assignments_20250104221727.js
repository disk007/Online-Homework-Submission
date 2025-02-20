const router = require('express').Router()
const assignments = require('../Controllers/assignments')
const express = require('express')
const path = require('path');
const upload = require('../Middleware/uploadFile')

router.get('/list-assignments/:id',assignments.list_assignments)
router.get('/detail-assignment/:assignmentId',assignments.detail_assignment)
router.get('/up-comming/:id',assignments.all_up_comming)
router.get('/all-past-due/:id',assignments.all_past_due)
router.get('/all-completed/:id',assignments.all_completed)
router.get('/up-comming/:id/:id_classroom',assignments.up_comming)
router.get('/past-due/:id/:id_classroom',assignments.past_due)
router.get('/completed/:id/:id_classroom',assignments.completed)
router.get('/activity/:id/',assignments.activity)
router.get('/activity-teacher/:id/',assignments.activity_teacher)
router.post('/add-assignment',upload.any(),assignments.add_assignments)
router.get('/assignments/:id_assignment/:workId/file/:fileName',assignments.check_type_file)
router.use('/assignments',express.static('assignments'))

module.exports = router;