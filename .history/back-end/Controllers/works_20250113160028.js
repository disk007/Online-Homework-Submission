const db = require('../Model/database')
const fs = require('fs');
const path = require('path');
exports.detail_work = async(req,res)=>{
    try {
        const {user_id} = req.params
        console.log(user_id)
        const querySql = `SELECT 
            a.id AS id_assignment,
            a.title,
            w.id,
            a.due_time,
            a.colses_time,
            a.instructions,
            a.reference_files,
            c.name ,
            STRING_AGG(u.fname || ' ' || u.lname, ', ') AS group_members
        FROM 
            assignment AS a
        INNER JOIN 
            work AS w ON w.id_assignment = a.id
        INNER JOIN 
            classroom AS c ON c.id = a.id_classroom
        LEFT JOIN 
            groups_member AS gm ON gm.id_group = w.id_group
        LEFT JOIN 
            users AS u ON u.id = gm.id_user
        WHERE 
            w.id_user = $1
            OR gm.id_group IN (
                SELECT gm_sub.id_group
                FROM groups_member AS gm_sub
                WHERE gm_sub.id_user = $1
            )
        GROUP BY 
            a.id,
            a.title,
            a.due_time,
            a.colses_time,
            a.instructions,
            a.reference_files,
            c.name,
            w.id_group,
            w.id
        ORDER BY 
            a.id DESC`
        const result = await db.query(querySql,[user_id])
        return res.json(result.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.my_work = async(req,res) => {
    try {
        const {user_id} = req.params
        const querySql = `SELECT a.id AS id_assignment,a.due_time,a.colses_time,w.work,w.id,w.is_submitted,w.sent_date,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			LEFT JOIN 
                groups_member AS gm ON gm.id_group = w.id_group
            WHERE w.id_user = $1 OR gm.id_user = $1`
        const result = await db.query(querySql,[user_id])
        return res.json(result.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.send_work = async(req, res) => {
    try {
        const {id_user,id_work,fileName,send_date} = req.body
        const sendDate = new Date(send_date)
        const formatDate = `${sendDate.getFullYear()}-${(sendDate.getMonth() + 1).toString().padStart(2, '0')}-${sendDate.getDate().toString().padStart(2, '0')} ${sendDate.getHours().toString().padStart(2, '0')}:${sendDate.getMinutes().toString().padStart(2, '0')}:00`
        const queryCheckType = `SELECT a.assignment_type,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        let sqlFileName
        if(resultCheckType.rows[0].assignment_type === 'group'){
            sqlFileName = await db.query('SELECT work FROM work INNER JOIN groups_member AS gm ON gm.id_group = work.id_group WHERE id = $1 AND gm.id_user = $2',[id_work,id_user])
        }
        else{
            sqlFileName = await db.query('SELECT work FROM work WHERE id = $1 AND id_user = $2',[id_work,id_user])
        }
        let existingFileNames = [];
        if (sqlFileName.rows[0].work) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].work);
        }
        let filterFileName = null;
        let result = null
        if(resultCheckType.rows[0].assignment_type === 'group'){
            if(fileName != 'null'){
                existingFileNames = [...existingFileNames, ...fileName];
                const filterFileName = JSON.stringify(existingFileNames);
                const querySql = `UPDATE work SET is_submitted = $1, work = $2 ,sent_date =$3 FROM groups_member AS gm
                        WHERE 
                            gm.id_group = work.id_group
                            AND gm.id_user = $4
                            AND work.id = $5 RETURNING id_assignment`
                result = await db.query(querySql,[true,filterFileName,formatDate,id_user,id_work])
            }
            else{
                const querySql = `UPDATE work SET is_submitted = $1 , sent_date = $2 FROM groups_member AS gm
                        WHERE 
                            gm.id_group = work.id_group
                            AND gm.id_user = $3
                            AND work.id = $4 RETURNING id_assignment`
                result = await db.query(querySql,[true,formatDate,id_user,id_work])
            }
        }
        else{
            if(fileName != 'null'){
                existingFileNames = [...existingFileNames, ...fileName];
                const filterFileName = JSON.stringify(existingFileNames);
                const querySql = `UPDATE work SET is_submitted = $1, work = $2 ,sent_date =$3  WHERE id_user = $4 AND id = $5 RETURNING id_assignment`
                result = await db.query(querySql,[true,filterFileName,formatDate,id_user,id_work])
            }
            else{
                const querySql = `UPDATE work SET is_submitted = $1 , sent_date = $2 WHERE id_user = $3 AND id = $4 RETURNING id_assignment`
                result = await db.query(querySql,[true,formatDate,id_user,id_work])
            }
        }
        console.log(filterFileName)
        if (req.files && req.body) {
            req.files.forEach((file, index) => {
                console.log("file.path "+file.path)
                console.log(file, fileName[index])
                const folderFile = path.join(__dirname,'../assignments',result.rows[0].id_assignment.toString(),id_work.toString(),resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString());
                const newPath = path.join(folderFile,fileName[index]);
                if (fs.existsSync(file.path)) {
                    try {
                        fs.copyFileSync(file.path, newPath)
                        console.log(`File copy successfully to ${newPath}`);
                    } catch (err) {
                        console.error('Error moving file:', err);
                    }
                } else {
                    console.error(`File not found: ${file.path}`);
                }
            });
        }
        if (req.files) {
            req.files.forEach((file) => {
                try {
                    fs.unlinkSync(file.path)
                    console.log(`File deleted successfully ${file.path}`);
                } catch (err) {
                    console.error(`Error deleting original file: ${file.path}`, err);
                }
            });
        }
        return res.json({status: 'success', message:'Work saved!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.cancel_work = async (req, res) => {
    try {
        const {id_user,id_work} = req.body;
        const queryCheckType = `SELECT a.assignment_type,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        console.log(id_user,id_work)
        let querySql
        if(resultCheckType.rows[0].assignment_type === 'group'){
            querySql = `UPDATE work SET is_submitted = $1 ,sent_date = $2 FROM groups_member AS gm
                WHERE 
                    gm.id_group = work.id_group
                    AND gm.id_user = $3
                    AND work.id = $4`
        }
        else{
            querySql = `UPDATE work SET is_submitted = $1,sent_date = $2 WHERE id_user = $3 AND id = $4 `
        }
        
        await db.query(querySql,[false,null,id_user,id_work])
        return res.json({status: 'success', message:'Work canceled!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_work = async (req, res) => {
    try {
        const {id_user,id_work,fileName,id_assignment} = req.body
        const queryCheckType = `SELECT a.assignment_type,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        const folderFile = path.join(__dirname,'../assignments',id_assignment,id_work,resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString(),fileName);
        let selectWork
        if(resultCheckType.rows[0].assignment_type === 'group'){
            selectWork = `SELECT work FROM work INNER JOIN groups_member AS gm ON gm.id_group = work.id_group WHERE id = $1 AND gm.id_user = $2`
        }
        else{
            selectWork = 'SELECT work FROM work WHERE id = $1 AND id_user = $2'
        }
        const sqlFileName = await db.query(selectWork,[id_work,id_user])
        let existingFileNames = [];
        if (sqlFileName.rows[0].work) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].work);
        }
        existingFileNames = existingFileNames.filter(f => f !== fileName);
        const filterFileName = existingFileNames.length > 0 ? JSON.stringify(existingFileNames) : null;
        let upadteWork
        if(resultCheckType.rows[0].assignment_type === 'group'){
            upadteWork = `UPDATE work SET work = $1 FROM groups_member AS gm
                WHERE 
                    gm.id_group = work.id_group
                    AND gm.id_user = $2
                    AND work.id = $3`
        }
        else{
            upadteWork = 'UPDATE work SET work = $1 WHERE id_user = $2 AND id = $3'
        }
        await db.query(upadteWork,[filterFileName,id_user,id_work])
        fs.unlinkSync(folderFile)
        return res.json({status: 'success'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.comment_work = async (req,res) => {
    try {
        const {id_user,id_work,comment} = req.body
        console.log(comment)
        return res.json({status: 'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_feedback = async (req,res) => {
    try {
        const {id_work,id,assignment_type,feedback,score} = req.body
        const idArray = JSON.parse(id)
        const feedbackArray = JSON.parse(feedback)
        const scoreArray = JSON.parse(score)
        console.log(id_work,id,assignment_type,feedback,score)
        if(assignment_type === 'group'){
            idArray.map(async (d,i) => {
                console.log("id_group",d)
                console.log(feedbackArray[i])
                console.log(scoreArray[i])
                await db.query('UPDATE work SET ')
            })
        }
        else{

        }
        return res.json({status: 'success', message: 'Returned successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
