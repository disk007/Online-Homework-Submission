const router = require('express').Router()
const assignments = require('../Controllers/assignments')
const express = require('express')
const path = require('path');
const upload = require('../Middleware/uploadFile')

module.exports = (io) => {
    router.get('/list-assignments/:id',assignments.list_assignments)
    router.get('/page-post-assignments/:id',assignments.page_post_assignments)
    router.get('/detail-assignment/:assignmentId',assignments.detail_assignment)
    router.get('/verified-assignment/:assignmentId',assignments.verified_assignment)
    router.get('/all-up-comming/:id',assignments.all_up_comming)
    router.get('/all-past-due/:id',assignments.all_past_due)
    router.get('/all-completed/:id',assignments.all_completed)
    router.get('/up-comming/:id/:id_classroom',assignments.up_comming)
    router.get('/past-due/:id/:id_classroom',assignments.past_due)
    router.get('/completed/:id/:id_classroom',assignments.completed)
    router.get('/activity/:id/',(req, res) => assignments.activity(req, res, io))
    router.get('/activity-group/:id/',assignments.activity_group)
    router.get('/activity-teacher/:id/',assignments.activity_teacher)
    router.post('/add-assignment',upload.any(),assignments.add_assignments)
    router.post('/delete-assignment',assignments.delete_assignment)
    router.post('/update-assignment',upload.any(),assignments.update_assignment)
    router.get('/assignments/:id_assignment/:workId/file/:fileName',assignments.check_type_file)
    router.get('/size-files-assignments/:id_assignment/:id',assignments.get_file_size)
    router.get('/data-assignment/:id_assignment',assignments.data_assignment)
    router.post('/delete-sheet',assignments.delete_sheet)
    router.get('/remember-groups/:classroomId',assignments.remember_groups)
// router.use('/assignments',express.static('assignments'))
    return router
}

