const db = require('../Model/database')
const fs = require('fs');
const path = require('path');
const cloudinary = require('../Middleware/cloudinary')
const jwt = require("jsonwebtoken")
require('dotenv').config()
exports.detail_work = async(req,res)=>{
    try {
        
        const {work_id,user_id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }

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
            w.id = $1 AND (w.id_user = $2
            OR gm.id_group IN (
                SELECT gm_sub.id_group
                FROM groups_member AS gm_sub
                WHERE gm_sub.id_user = $2
            ))
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
        const result = await db.query(querySql,[work_id,user_id])
        return res.json(result.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.my_work = async(req,res) => {
    try {
        const {work_id,user_id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.assignment_type,a.id AS id_assignment,a.due_time,a.colses_time,w.work,w.verify,w.feedback,w.id,w.is_submitted,w.sent_date,w.id_group,(a.score) AS Ascore,(w.score) AS Wscore FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			LEFT JOIN 
                groups_member AS gm ON gm.id_group = w.id_group
            WHERE w.id = $1 AND (w.id_user = $2 OR gm.id_user = $2)`
        const result = await db.query(querySql,[work_id,user_id])
        return res.json(result.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.count_activity = async(req, res) => {
    try {
        const {user_id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT SUM(CASE WHEN w.activity = 'Initial' THEN 1 ELSE 0 END) AS count FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
			LEFT JOIN 
                groups_member AS gm ON gm.id_group = w.id_group
            WHERE (w.id_user = $1 OR gm.id_user = $1) AND m.id_user = $1`
        const result = await db.query(querySql,[user_id])
        return res.json({data:result.rows[0].count})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.count_teacher_activity = async(req,res) => {
    try{
        const {user_id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'student'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title, w.id_assignment,w.id FROM work AS w
            INNER JOIN assignment AS a ON a.id = w.id_assignment
            INNER JOIN classroom AS c ON c.id = a.id_classroom
            WHERE c.id_user = $1 AND w.activity = 'InitialT'
            GROUP BY w.id_assignment,a.title,w.id`
        const result = await db.query(querySql,[user_id])
        return res.json({data:result.rows.length})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_activity = async(req, res) => {
    try {
        const {id_user,id_work,type} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        let querySql 
        if(type === 'group'){
            const sql_id = `SELECT w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			LEFT JOIN 
                groups_member AS gm ON gm.id_group = w.id_group
            WHERE w.id = $1 AND (w.id_user = $2 OR gm.id_user = $2)`
            const id_group = await db.query(sql_id,[id_work,id_user])
            querySql = `UPDATE work SET activity = 'Viewed' WHERE id_group = $1 AND id = $2`
            await db.query(querySql,[id_group.rows[0].id_group,id_work])
        }
        else{
            querySql = `UPDATE work SET activity = 'Viewed' WHERE id_user = $1 AND id = $2`
            await db.query(querySql,[id_user,id_work])
        }
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_teacher_activity = async(req,res) => {
    try {
        const {id_assignment,id_classroom} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'student'){
            return res.sendStatus(403);
        }
        // console.log(id_assignment,id_classroom)
        const querySql = `UPDATE work
            SET activity = 'ViewedT'
            FROM assignment
            WHERE work.id_assignment = assignment.id
            AND work.id_assignment = $1
            AND assignment.id_classroom = $2
            AND work.is_submitted = true`
        await db.query(querySql,[id_assignment,id_classroom])
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_state_activity = async(req, res) => {
    try {
        const {id_user} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `UPDATE work SET activity = 'No' WHERE id_user = $1 AND activity = 'Initial'`
        await db.query(querySql,[id_user])
        const queryIdGroup = `SELECT g.id FROM groups AS g
            INNER JOIN groups_member AS gm ON gm.id_group = g.id
            WHERE gm.id_user = $1`
        const id_group = await db.query(queryIdGroup,[id_user])
        if(id_group.rows.length > 0){
            id_group.rows.map(async(data) =>{
                console.log("data ",data.id)
                const queryUpdateGroup = `UPDATE work SET activity = 'No' WHERE id_group = $1 AND activity = 'Initial'`
                await db.query(queryUpdateGroup,[data.id])
            })
            // const queryUpdateGroup = `UPDATE work SET activity = 'Viewed' WHERE id_group = $1 AND activity = 'Initial'`
            // await db.query(queryUpdateGroup,[id_group.rows[0].id])
        }
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_state_teacher_activity = async(req, res) => {
    try {
        const {id_user} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'student'){
            return res.sendStatus(403);
        }
        const querySql = `UPDATE work
            SET activity = 'NoT'
            FROM assignment
            INNER JOIN classroom ON assignment.id_classroom = classroom.id
            WHERE work.id_assignment = assignment.id
            AND classroom.id_user = $1
            AND work.activity = 'InitialT'
            `
        await db.query(querySql,[id_user])
        // const queryIdGroup = `SELECT g.id FROM groups AS g
        //     INNER JOIN groups_member AS gm ON gm.id_group = g.id
        //     WHERE gm.id_user = $1`
        // const id_group = await db.query(queryIdGroup,[id_user])
        // if(id_group.rows.length > 0){
        //     id_group.rows.map(async(data) =>{
        //         console.log("data ",data.id)
        //         const queryUpdateGroup = `UPDATE work SET activity = 'No' WHERE id_group = $1 AND activity = 'Initial'`
        //         await db.query(queryUpdateGroup,[data.id])
        //     })
        //     // const queryUpdateGroup = `UPDATE work SET activity = 'Viewed' WHERE id_group = $1 AND activity = 'Initial'`
        //     // await db.query(queryUpdateGroup,[id_group.rows[0].id])
        // }
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.send_work = async(req, res) => {
    try {
        const {id_user,id_work,fileName,send_date} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const sendDate = new Date(send_date)
        const formatDate = `${sendDate.getFullYear()}-${(sendDate.getMonth() + 1).toString().padStart(2, '0')}-${sendDate.getDate().toString().padStart(2, '0')} ${sendDate.getHours().toString().padStart(2, '0')}:${sendDate.getMinutes().toString().padStart(2, '0')}:00`
        const queryCheckType = `SELECT a.assignment_type,w.id_group,a.id_classroom,a.colses_time FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        const date_closes = new Date(resultCheckType.rows[0].colses_time)
        console.log("date1 ",sendDate.getTime()," date2 ",date_closes.getTime())
        if(date_closes.getTime() !== 0){
        if(sendDate.getTime() > date_closes.getTime()){
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
            return res.json({status:'deadline', message:'Submission deadline has passed.'});
        }
        }
        let sqlFileName
        if(resultCheckType.rows[0].assignment_type === 'group'){
            sqlFileName = await db.query('SELECT work,work.id_group FROM work INNER JOIN groups_member AS gm ON gm.id_group = work.id_group WHERE id = $1 AND gm.id_user = $2',[id_work,id_user])
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
                const querySql = `UPDATE work SET is_submitted = $1, work = $2 ,sent_date =$3,verify = $4,activity = 'InitialT' FROM groups_member AS gm
                        WHERE 
                            gm.id_group = work.id_group
                            AND gm.id_user = $5
                            AND work.id = $6 RETURNING id_assignment`
                result = await db.query(querySql,[true,filterFileName,formatDate,false,id_user,id_work])
            }
            else{
                const querySql = `UPDATE work SET is_submitted = $1 , sent_date = $2,verify = $3,activity = 'InitialT' FROM groups_member AS gm
                        WHERE 
                            gm.id_group = work.id_group
                            AND gm.id_user = $4
                            AND work.id = $5 RETURNING id_assignment`
                result = await db.query(querySql,[true,formatDate,false,id_user,id_work])
            }
        }
        else{
            if(fileName != 'null'){
                existingFileNames = [...existingFileNames, ...fileName];
                const filterFileName = JSON.stringify(existingFileNames);
                const querySql = `UPDATE work SET is_submitted = $1, work = $2 ,sent_date =$3,verify = $4,activity = 'InitialT'  WHERE id_user = $5 AND id = $6 RETURNING id_assignment`
                result = await db.query(querySql,[true,filterFileName,formatDate,false,id_user,id_work])
            }
            else{
                const querySql = `UPDATE work SET is_submitted = $1 , sent_date = $2,verify=$3,activity = 'InitialT' WHERE id_user = $4 AND id = $5 RETURNING id_assignment`
                result = await db.query(querySql,[true,formatDate,false,id_user,id_work])
            }
        }
        console.log(filterFileName)
        if (req.files && req.body) {
            const folderPath = `assignments/${result.rows[0].id_assignment}/${id_work}/${resultCheckType.rows[0].assignment_type === 'group' ? sqlFileName.rows[0].id_group : id_user}`;
            await cloudinary.api.create_folder(folderPath);
            if (req.files && req.body) {
                for (let i = 0; i < req.files.length; i++) {
                    // 🗑️ ลบไฟล์ต้นฉบับออกจากโฟลเดอร์ 'files/'
                    const file = req.files[i];
                    const filePath = file.path
                    const fileName = req.body.fileName[i]; 
                    console.log("fileName ",fileName)
                    const result = await cloudinary.uploader.upload(filePath, {
                        resource_type: "auto",
                        folder: `${folderPath}`,
                        public_id: fileName, // ใช้ชื่อไฟล์ที่กำหนด
                        invalidate: true
                    });
                    // await cloudinary.uploader.destroy(`${oldPath}`);
                }
            }
        }
        // if (req.files && req.body) {
        //     const Path = path.join(__dirname,'../assignments',result.rows[0].id_assignment.toString(),id_work.toString(),resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString())
        //     fs.mkdirSync(Path, { recursive: true })
        //     req.files.forEach((file, index) => {
        //         console.log("file.path "+file.path)
        //         console.log(file, fileName[index])
        //         const folderFile = path.join(__dirname,'../assignments',result.rows[0].id_assignment.toString(),id_work.toString(),resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString());
        //         const newPath = path.join(folderFile,fileName[index]);
        //         if (fs.existsSync(file.path)) {
        //             try {
        //                 fs.copyFileSync(file.path, newPath)
        //                 console.log(`File copy successfully to ${newPath}`);
        //             } catch (err) {
        //                 console.error('Error moving file:', err);
        //             }
        //         } else {
        //             console.error(`File not found: ${file.path}`);
        //         }
        //     });
        // }
        // if (req.files) {
        //     req.files.forEach((file) => {
        //         try {
        //             fs.unlinkSync(file.path)
        //             console.log(`File deleted successfully ${file.path}`);
        //         } catch (err) {
        //             console.error(`Error deleting original file: ${file.path}`, err);
        //         }
        //     });
        // }
        const io = req.app.get("io");
        if (io){
            io.sockets.sockets.forEach((socket) => {
                const userRooms = socket.data.sendWork || []; // 🔥 ดึงห้องที่ socket join ไว้
                const roomId = String(resultCheckType.rows[0].id_classroom); // แปลงเป็น string
                // console.log('id_classroom',roomId)
                // console.log('userRooms ',userRooms)
                if (userRooms.includes(roomId)) {
                    console.log(`Broadcasting to room: ${roomId} ${userRooms}`);
                    io.to(String(roomId)).emit("activity-teacher");
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
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const queryCheckType = `SELECT a.assignment_type,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        console.log(id_user,id_work)
        let querySql
        if(resultCheckType.rows[0].assignment_type === 'group'){
            querySql = `UPDATE work SET is_submitted = $1 ,sent_date = $2,verify = $3,activity = 'Viewed' FROM groups_member AS gm
                WHERE 
                    gm.id_group = work.id_group
                    AND gm.id_user = $4
                    AND work.id = $5`
        }
        else{
            querySql = `UPDATE work SET is_submitted = $1,sent_date = $2,verify = $3,activity = 'Viewed' WHERE id_user = $4 AND id = $5 `
        }
        
        await db.query(querySql,[false,null,false,id_user,id_work])
        return res.json({status: 'success', message:'Work canceled!'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_work = async (req, res) => {
    try {
        const {id_user,id_work,fileName,id_assignment} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const queryCheckType = `SELECT a.assignment_type,w.id_group FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            WHERE w.id = $1
            GROUP BY a.id,w.id_group`
        const resultCheckType = await db.query(queryCheckType,[id_work])
        // const folderFile = path.join(__dirname,'../assignments',id_assignment,id_work,resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString(),fileName);
        const folderFile = decodeURIComponent(`assignments/${id_assignment}/${id_work}/${resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group : id_user}/${fileName}`)
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
        const fileExtension = fileName.split('.').pop();
        const resourceType = ["docx", "xlsx", "txt"].includes(fileExtension) ? "raw" : "image";
        // ดึงข้อมูลไฟล์จาก Cloudinary
        const result = await cloudinary.api.resource(folderFile, { resource_type: resourceType });
        console.log("Success:", result);

        // ลบไฟล์จาก Cloudinary
        await cloudinary.api.delete_resources([result.public_id], { resource_type: result.resource_type });
        // const resources = await cloudinary.api.resources_by_ids([folderFile]);
        console.log('folderFile ',folderFile)
        // for (const file of resources.resources) {
        //     // await cloudinary.api.delete_resources([file.public_id], { resource_type: file.resource_type });
        //     console.log(`ลบไฟล์สำเร็จ: ${file.public_id} (${file.resource_type})`);
        // }
        // fs.unlinkSync(folderFile)
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
                await db.query('UPDATE work SET feedback = $1 , score = $2 , verify = $3 WHERE id_group = $4 AND id = $5',[feedbackArray[i],scoreArray[i],true,d,id_work])
            })
        }
        else{
            idArray.map(async (d,i) => {
                await db.query('UPDATE work SET feedback = $1 , score = $2 , verify = $3 WHERE id_user = $4 AND id = $5',[feedbackArray[i],scoreArray[i],true,d,id_work])
            })
        }
        return res.json({status: 'success', message: 'Returned successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.open_file_work = async (req, res) => {
    try {
        const {id_assignment, workId, fileName,id_user } = req.params;
        console.log("fileName ",fileName)
        // const filePath = path.join(__dirname, '../assignments', id_assignment, workId,id_user, fileName);
        const n = encodeURIComponent(fileName).replace(/\(/g, "%28").replace(/\)/g, "%29");
        console.log("n ",n)
        const fileExtension = fileName.split('.').pop();
        const fileUrl = `https://res.cloudinary.com/${process.env.YOUR_CLOUD_NAME}/${fileExtension === 'docx' || fileExtension === 'xlsx' || fileExtension === 'txt' ? 'raw' : 'image'}/upload/assignments/${id_assignment}/${workId}/${id_user}/${n}${fileExtension === 'docx' || fileExtension === 'xlsx' || fileExtension === 'txt' ? '' : `.${fileExtension}`}`
        console.log(fileUrl)
        return res.redirect(fileUrl);
        // cloudinary.api.resource(filePublicId, { 
        //     type: 'upload'
        // }, (error, result) => {
        //     if (error) {
        //         console.error('Error fetching file from Cloudinary:', error);
        //         return res.status(500).json({ error: 'Error fetching file from Cloudinary' });
        //     }
            
        //     // สร้าง URL ของไฟล์ที่ได้จาก Cloudinary
        //     const fileUrl = result.url;
        //     console.log(result.resource_type)
        //     console.log(result.url)
        //     return res.redirect(fileUrl);  // หรือคุณสามารถใช้ res.sendFile() ได้หากดาวน์โหลดไฟล์
        // })
        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        // console.log(filePath);
        // return res.sendFile(filePath)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const calculateTotalFileSize = (directoryPath) => {
    let totalSize = 0;

    // อ่านไฟล์ทั้งหมดในไดเรกทอรี
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        // ตรวจสอบว่าเป็นไฟล์หรือโฟลเดอร์
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            // เพิ่มขนาดของไฟล์
            totalSize += stats.size;
        } else if (stats.isDirectory()) {
            // ถ้าเป็นโฟลเดอร์ ให้เรียกฟังก์ชันนี้แบบ recursive
            totalSize += calculateTotalFileSize(filePath);
        }
    });

    return totalSize;
};

exports.get_file_size = async (req, res) => {
    try {
        const {workId} = req.params;
        
        const data_work = await db.query('SELECT work.id_assignment,id,work.id_user,work.id_group FROM work WHERE id = $1',[workId])
        let id
        if(data_work.rows[0].id_group != null){
            id = data_work.rows[0].id_group
        }
        else{
            id = data_work.rows[0].id_user
        }
        let totalSize = 0
        const directoryPath = `assignments/${data_work.rows[0].id_assignment}/${data_work.rows[0].id}/${id}`
        console.log(directoryPath)
        const resources = await cloudinary.api.resources({
            prefix: directoryPath,   
            max_results: 500,     
            type: 'upload',
            resource_type: 'raw'
        });
        if (resources.resources.length === 0) {
            console.log("ไม่พบไฟล์ในโฟลเดอร์นี้");
        } else {
            totalSize = resources.resources.reduce((sum, file) => sum + file.bytes, 0);
        }
        console.log('totalSize ',totalSize)
        // const directoryPath = path.join(__dirname, '../assignments', id_assignment, workId,id);
        // if (!fs.existsSync(directoryPath)) {
        //     console.log('Directory not found:', directoryPath);
        //     return res.json({ size: 0 }); // ถ้า path ไม่พบ ให้ return 0
        // }
        // const totalSize = calculateTotalFileSize(directoryPath);
        // console.log('Total size:', totalSize);
        return res.json({ size: totalSize });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.get_score = async (req, res) => {
    try {
        const {id_assignment} = req.params
        const queryCheckIdwork = `SELECT a.assignment_type FROM assignment AS a WHERE a.id = $1`
        const check_type_assignment = await db.query(queryCheckIdwork,[id_assignment])
        let query
        if(check_type_assignment.rows[0].assignment_type === 'group'){
            query = `SELECT a.score AS ascore,a.title,CONCAT(u.fname, ' ', u.lname) AS name,w.score AS wscore FROM assignment AS a
                INNER JOIN work AS w ON w.id_assignment = a.id
                INNER JOIN groups AS g ON g.id = w.id_group
                INNER JOIN groups_member AS gm ON gm.id_group = g.id
                INNER JOIN users AS u ON u.id = gm.id_user
                WHERE a.id = $1 `
        }
        else{
            query = `SELECT a.score AS ascore,a.title,CONCAT(u.fname, ' ', u.lname) AS name,w.score AS wscore FROM assignment AS a
                INNER JOIN work AS w ON w.id_assignment = a.id
                INNER JOIN users AS u ON u.id = w.id_user
                WHERE a.id = $1`
        }
        
        const result = await db.query(query,[id_assignment])
        // console.log(result.rows)
        return res.json(result.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.add_comment_work = async(req, res) => {
    try {
        const {message,id_work,date,id_user} = req.body
        const convertDate = new Date(date)

        const curentDate = `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1).toString().padStart(2, '0')}-${convertDate.getDate().toString().padStart(2, '0')} ${convertDate.getHours().toString().padStart(2, '0')}:${convertDate.getMinutes().toString().padStart(2, '0')}:00`
        const querySql = `INSERT INTO comment_work (message,date,id_work,id_user) VALUES ($1,$2,$3,$4)`
        await db.query(querySql,[message,curentDate,id_work,id_user])
        return res.json({status: 'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.get_comment_work = async (req, res) => {
    try {
        const {id_work,id_user} = req.params
        console.log(id_work,id_user)
        const querySql = `SELECT cw.message,cw.date,CONCAT(u.fname, ' ', u.lname) AS name FROM comment_work AS cw
            INNER JOIN users AS u ON u.id = cw.id_user 
            WHERE cw.id_work = $1 AND cw.id_user = $2 ORDER BY cw.id DESC`
        const result = await db.query(querySql,[id_work,id_user])
        return res.json(result.rows)
        // else{
        //     return res.json({status: 'Not found'})
        // }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.page_post_works = async (req, res) => {
    try {
        const { id,id_user } = req.params;
        const querySql = `SELECT
            a.title,
            a.due_time,
            a.id AS id_assignment,
            a.create_at,
            w.id AS work_id
            FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND a.id_classroom = $2 `
        const result = await db.query(querySql, [id_user,id]);
        // console.log(result.rows);
        return res.json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

// exports.op_file = async (req, res) => {
//     try {
//         const { id_assignment, workId, fileName } = req.params;
//         const filePath = path.join(__dirname, '../assignments', id_assignment, workId,'file', fileName);
//         // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
//         console.log(filePath);
//         return res.sendFile(filePath)
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: error.message });

//     }
// }