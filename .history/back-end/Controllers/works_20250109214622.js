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
        const queryCheckType = `SELECT a.assignment_type FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id`
        let sqlFileName
        if(queryCheckType === 'group'){
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
        if(fileName != 'null'){
            existingFileNames = [...existingFileNames, ...fileName];
            const filterFileName = JSON.stringify(existingFileNames);
            const querySql = `UPDATE work SET is_submitted = $1, work = $2 , sent_date =$3 WHERE id_user = $4 AND id = $5 RETURNING id_assignment`
            result = await db.query(querySql,[true,filterFileName,formatDate,id_user,id_work])
        }
        else{
            const querySql = `UPDATE work SET is_submitted = $1 , sent_date = $2 WHERE id_user = $3 AND id = $4 RETURNING id_assignment`
            result = await db.query(querySql,[true,formatDate,id_user,id_work])
        }
        console.log(filterFileName)
        if (req.files && req.body) {
            req.files.forEach((file, index) => {
                console.log("file.path "+file.path)
                console.log(file, fileName[index])
                const folderFile = path.join(__dirname,'../assignments',result.rows[0].id_assignment.toString(),queryCheckType === 'group' ? id_work.toString() : id_work.toString(),id_user.toString());
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
        console.log(id_user,id_work)
        const querySql = `UPDATE work SET is_submitted = $1,sent_date = $2 WHERE id_user = $3 AND id = $4 `
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
        const folderFile = path.join(__dirname,'../assignments',id_assignment,id_work,id_user,fileName);
        const sqlFileName = await db.query('SELECT work FROM work WHERE id = $1 AND id_user = $2',[id_work,id_user])
        let existingFileNames = [];
        if (sqlFileName.rows[0].work) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].work);
        }
        existingFileNames = existingFileNames.filter(f => f !== fileName);
        const filterFileName = existingFileNames.length > 0 ? JSON.stringify(existingFileNames) : null;
        const querySql = `UPDATE work SET work = $1 WHERE id_user = $2 AND id = $3`
        await db.query(querySql,[filterFileName,id_user,id_work])
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
