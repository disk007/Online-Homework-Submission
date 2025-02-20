const { error } = require('console');
const db = require('../Model/database')
const crypto = require('crypto')
const path = require("path");
const fs = require("fs");

function generateCode(length = 8) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

exports.add_classroom = async (req, res) => {
    try{
        const {name,id} = req.body
        let uniqueCode;
        let isUnique = false;
        while (!isUnique) {
            uniqueCode = generateCode();
            // Check if uniqueCode exists in the database
            const codeExists = await db.query('SELECT * FROM classroom WHERE code = $1', [uniqueCode]);

            if (codeExists.rows.length === 0) {
                isUnique = true;  // If no rows are found, it means the code is unique
            }
        }
        console.log(name, uniqueCode,id)
        const data = await db.query('INSERT INTO classroom (name, code, id_user) VALUES ($1, $2, $3) RETURNING id', [name, uniqueCode, id]);
        // const insertedId = data.rows[0].id;
        // const folderName = insertedId.toString()
        // const folderPath = path.join(__dirname, '../assignments',folderName);
        // fs.mkdir(folderPath, { recursive: true }, (err) => {
        //     if (err) {
        //       console.error('Error creating folder:', err);
        //     } else {
        //       console.log('Folder created successfully!');
        //     }
        // });
        return res.json({status:'success', text:'Classroom added!'});
    }
    catch(error){
        if (error.code === '23505') {  // 23505 คือ error code สำหรับ duplicate key
            return res.json({ status: 'error', message: 'Classroom name already exists.' });
        }
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.check_classroom_access = async (req, res) => {
    const { userId, classroomId } = req.body;
    try {
        const check_user = await db.query('SELECT * FROM users WHERE id = $1',[userId]);
        if(check_user.rows[0].role === 'teacher'){
            const isTeacher = await db.query(
                'SELECT * FROM classroom WHERE id = $1 AND id_user = $2',
                [classroomId,userId]
            );
            if (isTeacher.rows.length > 0) {
                return res.json({ isAuthorized: true }); 
            } else {
                return res.json({ isAuthorized: false }); 
            }
        }
        else if (check_user.rows[0].role === 'student'){
            const isStudent = await db.query(
                'SELECT * FROM members WHERE id_user = $1 AND id_classroom = $2',
                [userId, classroomId]
            );
            if (isStudent.rows.length > 0) {
                return res.json({ isAuthorized: true }); 
            } else {
                return res.json({ isAuthorized: false }); 
            }
        }
    } catch (error) {
        console.error('Error checking classroom access:', error);
        res.status(500).send('Server error');
    }
}

exports.check_detail_assignment = async(req, res) => {
    try {
        const {classroomId,assignmentId} = req.body
        const querySql = `SELECT w.id FROM assignment AS a
        INNER JOIN work AS w ON w.id_assignment = a.id
        WHERE a.id = $1 and a.id_classroom = $2`
        const result = await db.query(querySql,[assignmentId,classroomId])
        if(result.rows.length > 0){
            
            return res.json({ isAuthorized: true });
        }
        else{
            return res.json({ isAuthorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.re_code = async(req,res) => {
    try{
        const {classroom_id} = req.body
        console.log("classroom_id "+classroom_id)
        let uniqueCode
        let isUnique = false;
        while (!isUnique) {
            uniqueCode = generateCode();
            // Check if uniqueCode exists in the database
            const codeExists = await db.query('SELECT * FROM classroom WHERE code = $1', [uniqueCode]);
            if (codeExists.rows.length === 0) {
                isUnique = true;  // If no rows are found, it means the code is unique
            }
        }
        await db.query('UPDATE classroom SET code = $1 WHERE id = $2', [uniqueCode,classroom_id])
        return res.json({status:'success'});
    }
    catch (error) {
        console.error('Error checking classroom access:', error);
        res.status(500).send('Server error');
    }
}

exports.check_work_access = async(req,res) => {
    try {
        const { userId, workId ,classroomId } = req.body;
        const querySql = `SELECT work.id FROM work 
            INNER JOIN assignment ON assignment.id = work.id_assignment
            INNER JOIN classroom AS c ON c.id = assignment.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
            INNER JOIN members AS m ON m.id_classroom = assignment.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = work.id_group
            WHERE (work.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1  AND work.id = $2 AND c.id = $3`
        const isStudent = await db.query(querySql,[userId, workId,classroomId]
        );
        if (isStudent.rows.length > 0) {
            return res.json({ isAuthorized: true }); 
        } else {
            return res.json({ isAuthorized: false }); 
        }
    } catch (error) {
        console.error('Error checking classroom access:', error);
        return res.status(500).send('Server error');
    }
    
} 

exports.check_full_work_access = async(req,res) => {
    try {
        const { userId, workId } = req.body;
        const querySql = `SELECT work.id FROM work
            INNER JOIN assignment ON assignment.id = work.id_assignment
            INNER JOIN classroom AS c ON c.id = assignment.id_classroom
            INNER JOIN members AS m ON m.id_classroom = assignment.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = work.id_group
            WHERE (work.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND work.id = $2`
        const isStudent = await db.query(querySql,[userId, workId]
        );
        if (isStudent.rows.length > 0) {
            return res.json({ isAuthorized: true }); 
        } else {
            return res.json({ isAuthorized: false }); 
        }
    } catch (error) {
        console.error('Error checking classroom access:', error);
        res.status(500).send('Server error');
    }
    
} 

exports.display_classroom = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await db.query('SELECT * FROM classroom WHERE id_user = $1', [id]);
        return res.json(results.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.joined_classroom = async (req, res) => {
    try{
        const { id } = req.params;
        const queryText = `
            SELECT classroom.name,classroom.id
            FROM classroom
            INNER JOIN members ON members.id_classroom = classroom.id
            WHERE members.id_user = $1`
            
        const results = await db.query(queryText, [id]);
        return res.json(results.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.detail_classroom = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id)
        const results = await db.query('SELECT * FROM classroom WHERE id = $1', [id]);
        return res.json({id:results.rows[0].id,name: results.rows[0].name, code: results.rows[0].code});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.join_classroom = async (req, res) => {
    try{
        const { code, id_student } = req.body;
        console.log(code,id_student)
        const check_code = await db.query('SELECT * FROM classroom WHERE code = $1',[code])
        
        if(check_code.rows.length === 0){
            return res.json({status: 'error', message: "Invalid code" });
        }
        const check_member = await db.query('SELECT * FROM members WHERE id_classroom = $1 AND id_user = $2',[check_code.rows[0].id,id_student])
        if(check_member.rows.length > 0){
            return res.json({status: 'error', message: "You are already a member of this classroom" });
        }
        await db.query('INSERT INTO members (id_classroom, id_user) VALUES ($1, $2)', [check_code.rows[0].id,id_student]);
        
        const queryAss = `SELECT a.id AS assignment_id
                FROM assignment AS a
                LEFT JOIN work AS w
                ON a.id = w.id_assignment AND w.id_user = $1
                WHERE w.id IS NULL
                AND a.id_classroom = $2 AND a.assignment_type = 'All students'`
        const resultAss = await db.query(queryAss,[id_student,check_code.rows[0].id])
        let idWork = null;
        if(resultAss.rows.length > 0){
            const queryidWork = `SELECT w.id,w.id_assignment FROM work AS w
                INNER JOIN assignment AS a ON a.id = w.id_assignment
                WHERE w.id_assignment = $1
            `;
                idWork = await Promise.all(
                    resultAss.rows.map(async (d, i) => {
                        const result = await db.query(queryidWork,[d.assignment_id])
                        return result.rows;
                    })
                )
            const flattenedIdWork = idWork.flat();
            flattenedIdWork.map(async (d, i) => {
                await db.query('INSERT INTO work (id_assignment,id_user,id) VALUES ($1, $2, $3)',[d.id_assignment,id_student,d.id])
            })
        }
        return res.json({status:'success', text:'Classroom joined!'});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.teacher = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await db.query('SELECT * FROM users WHERE id = (SELECT id_user FROM classroom WHERE id = $1)', [id]);
        return res.json({name: results.rows[0].fname+" "+results.rows[0].lname});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.members = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await db.query('SELECT users.fname, users.lname,members.id_classroom,members.id_user FROM users INNER JOIN members ON users.id = members.id_user WHERE members.id_classroom = $1', [id]);
        return res.json(results.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_member = async (req, res) => {
    try{
        const members = req.body.members; // members จะเป็น array
        members.forEach(async member => {
            const { id_classroom, id_user } = member;
            await db.query('DELETE FROM members WHERE id_classroom = $1 AND id_user = $2',[id_classroom,id_user])
        })
        return res.json({status:'success', message : 'Member deleted successfully'})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

// exports.files = async (req, res) => {
//     try{
//         const viewer = new groupdocs.viewer.Viewer("../files/finalvision.docx")
//         const viewOptions = groupdocs.viewer.HtmlViewOptions.forEmbeddedResources("output-responsive.html")
//         viewOptions.setRenderResponsive(true)
//         return res.json({file: viewer.view(viewOptions)})
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({ error: error.message });
//     }
// }