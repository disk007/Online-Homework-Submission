const db = require('../Model/database')
const fs = require('fs');
const path = require('path');
const cloudinary = require('../Middleware/cloudinary')
const jwt = require("jsonwebtoken")
require('dotenv').config()
exports.add_assignments = async (req,res) => {
    try{
        const {title,instructions,points,dueDate,idClassroom,typeWork,members,dateClose,fileName,create_at} = req.body
        const token = req.cookies.token
        console.log(token)
        const role = jwt.verify(token, process.env.JWT_SECRET);
        console.log(role.role)
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        if(fileName !== 'null'){
            for(let i=0 ;i < fileName.length;i++){
                const curentFile = fileName[i]
                console.log("curentFile ",curentFile.length)
                if(curentFile.length > 200){
                    return res.json({status:'error', message:'File name is longer than 200 characters.'});
                }
            }
            
        }
        let filterFileName = null;
        if(fileName){
            filterFileName = JSON.stringify(fileName);
        }
        const due_Date = new Date(dueDate)
        const create = new Date(create_at)

        console.log("due_Date ",dueDate, "+ ",dueDate)

        const Date_create = `${create.getFullYear()}-${(create.getMonth() + 1).toString().padStart(2, '0')}-${create.getDate().toString().padStart(2, '0')} ${create.getHours().toString().padStart(2, '0')}:${create.getMinutes().toString().padStart(2, '0')}:00`
        const dueDateTime = `${due_Date.getFullYear()}-${(due_Date.getMonth() + 1).toString().padStart(2, '0')}-${due_Date.getDate().toString().padStart(2, '0')} ${due_Date.getHours().toString().padStart(2, '0')}:${due_Date.getMinutes().toString().padStart(2, '0')}:00`
        console.log("dueDateTime "+dueDateTime)
        let closeDateTime = null;
        if(dateClose !== ""){
            const closeDate = new Date(dateClose);
            closeDateTime = `${closeDate.getFullYear()}-${(closeDate.getMonth() + 1).toString().padStart(2, '0')}-${closeDate.getDate().toString().padStart(2, '0')} ${closeDate.getHours().toString().padStart(2, '0')}:${closeDate.getMinutes().toString().padStart(2, '0')}:00`
        }
        const idRoomArray = idClassroom.split(",").map(Number);
        const idRoom = await Promise.all(
            idRoomArray.map(async (data) => {
                const result = await db.query("SELECT id_classroom FROM members WHERE id_classroom = $1",[data])
                return result.rows[0]?.id_classroom
            })
        )
        const idRoomFilter = idRoom.filter((id)=> id !== undefined)
        let insertedIds
        if(typeWork === 'All students'){
            insertedIds = await Promise.all(
                idRoomFilter.map(async (d, i) => {
                    const result = await db.query(
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type,create_at) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'All students',Date_create]
                    );
                    return result.rows[0].id; // ดึง id ที่พึ่ง insert
                })
            );
        }
        else if(typeWork === 'Individual students'){
            insertedIds = await Promise.all(
                idRoomFilter.map(async (d, i) => {
                    const result = await db.query(
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type,create_at) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'Individual students',Date_create]
                    );
                    return result.rows[0].id; // ดึง id ที่พึ่ง insert
                })
            );
        }
        else if(typeWork === 'groups'){
            insertedIds = await Promise.all(
                idRoomFilter.map(async (d, i) => {
                    const result = await db.query(
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type,create_at) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'group',Date_create]
                    );
                    return result.rows[0].id; // ดึง id ที่พึ่ง insert
                })
            );
        }
        let insertIdWorks
        let students
        let idAssignmentWork
        let idWorkResult = await db.query("SELECT id FROM work ORDER BY id DESC LIMIT 1");
        let idWork = idWorkResult.rows[0]?.id ? idWorkResult.rows[0].id + 1 : 1; 
        if(typeWork === 'All students'){
            const queryFindIdAssignments = `SELECT members.id_user,assignment.id FROM members 
                INNER JOIN assignment ON assignment.id_classroom = members.id_classroom
                WHERE assignment.id = $1 `
            students = await Promise.all(
                insertedIds.map(async (d, i) => {
                    console.log(d)
                    const result = await db.query(queryFindIdAssignments,[d])
                    return result.rows;
                })
            )
            const updataStudents = students.flatMap((sub)=>{
                const currentIdWork = idWork
                idWork++
                return sub.map((obj) =>({
                    ...obj,
                    idWork:currentIdWork
                }))
            })
            insertIdWorks = await Promise.all(
                updataStudents.map(async obj => {
                    const result = await db.query(
                        "INSERT INTO work (id,id_user, id_assignment) VALUES ($1, $2 ,$3) RETURNING id",
                        [obj.idWork,obj.id_user, obj.id] // ปรับ id_assignment ตามที่เหมาะสม
                    );
                    return result.rows[0].id; // คืนค่า id ที่คืนจาก query
                })
            );
            insertIdWorks = [...new Set(insertIdWorks)];// แสดงผล id ทั้งหมด
            idAssignmentWork = await Promise.all(
                insertIdWorks.map(async(data)=>{
                    const result = await db.query(`SELECT id, id_user, id_assignment FROM work WHERE id = $1 `,[data])
                    return result.rows;
                })
            ) 
            console.log(idAssignmentWork)
        }
        else if(typeWork === 'Individual students'){
            const memberArray = members.split(',').map(Number);
            insertIdWorks = await Promise.all(
                memberArray.map(async (data) => {
                    const result = await db.query("INSERT INTO work (id,id_user,id_assignment) VALUES ($1,$2,$3) RETURNING id",
                        [idWork,data,insertedIds[0]]
                    )
                    return result.rows[0].id
                })
            )
            insertIdWorks = [...new Set(insertIdWorks)];// แสดงผล id ทั้งหมด
            idAssignmentWork = await Promise.all(
                insertIdWorks.map(async(data)=>{
                    const result = await db.query(`SELECT id, id_user, id_assignment FROM work WHERE id = $1 `,[data])
                    return result.rows;
                })
            ) 
        }
        else if(typeWork === "groups"){
            const membersArray = JSON.parse(members)
            const idGroups = await Promise.all(
                membersArray.map(async (group) => {
                    console.log(group.name)
                    const id = await db.query("INSERT INTO groups (name) VALUES ($1) RETURNING id",[group.name])
                    await Promise.all(
                        group.members.map(async (member) => {
                            await db.query("INSERT INTO groups_member (id_user,id_group) VALUES ($1,$2)",[member.id_user,id.rows[0].id])
                        })
                    )
                    console.log("id.rows "+id.rows[0].id)
                    return id.rows[0].id
                })
            )
            // const idGroups = idGroups.split(",").map(Number);
            insertIdWorks = await Promise.all(
                idGroups.map(async (data) => {
                    console.log(data)
                    const result = await db.query("INSERT INTO work (id,id_group,id_assignment) VALUES ($1,$2,$3) RETURNING id",
                        [idWork,data,insertedIds[0]]
                    )
                    return result.rows[0].id
                })
            )
            const check_groups_members = await db.query("SELECT * FROM groups_remember WHERE id_classroom = $1",[idRoomFilter[0]])
            if(check_groups_members.rows.length === 0){
                let lastGroupId = null;
                let groupIndex = 0;
                const insertData = [];

                membersArray.forEach((group, i) => {
                    if (idGroups[i] !== lastGroupId) {
                        lastGroupId = idGroups[i];
                        groupIndex++; // เพิ่มค่า index เมื่อ idGroups[i] เปลี่ยนแปลง
                    }
            
                    group.members.forEach((member) => {
                        insertData.push([member.id_user, groupIndex, idRoomFilter[0],group.name]);
                    });
                });
                
                const placeholders = insertData
                    .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
                    .join(", ");
                const query = `INSERT INTO groups_remember (id_user, no_group, id_classroom, name) VALUES ${placeholders}`;
                await db.query(query, insertData.flat());
            }
            else{
                await db.query("DELETE FROM groups_remember WHERE id_classroom = $1",[idRoomFilter[0]])
                let lastGroupId = null;
                let groupIndex = 0;
                const insertData = [];

                membersArray.forEach((group, i) => {
                    if (idGroups[i] !== lastGroupId) {
                        lastGroupId = idGroups[i];
                        groupIndex++; // เพิ่มค่า index เมื่อ idGroups[i] เปลี่ยนแปลง
                    }
            
                    group.members.forEach((member) => {
                        insertData.push([member.id_user, groupIndex, idRoomFilter[0],group.name]);
                    });
                });
            
                const placeholders = insertData
                    .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
                    .join(", ");
                const query = `INSERT INTO groups_remember (id_user, no_group, id_classroom, name) VALUES ${placeholders}`;
                await db.query(query, insertData.flat()); 
            }

            insertIdWorks = [...new Set(insertIdWorks)];// แสดงผล id ทั้งหมด
            idAssignmentWork = await Promise.all(
                insertIdWorks.map(async(data)=>{
                    console.log("data "+data)
                    const result = await db.query(`SELECT id, id_group, id_assignment FROM work WHERE id = $1 `,[data])
                    return result.rows;
                })
            ) 
        }
        const IdsAssignments = idAssignmentWork.flatMap(sub => sub);
        for (const obj of IdsAssignments) {
            try {
                // 🗂️ สร้างโฟลเดอร์สำหรับงาน
                const folderPath = `assignments/${obj.id_assignment}/${obj.id}/${
                    typeWork === "groups" ? obj.id_group : obj.id_user
                }`;
                const folderFile = `assignments/${obj.id_assignment}/${obj.id}/file`
                await cloudinary.api.create_folder(folderPath);
                if (req.files && req.body) {
                    for (let i = 0; i < req.files.length; i++) {
                        // 🗑️ ลบไฟล์ต้นฉบับออกจากโฟลเดอร์ 'files/'
                        const file = req.files[i];
                        console.log("file ",file)
                        const filePath = file.path
                        const oldPath = `files/${path.basename(file.filename)}`;
                        const fileName = req.body.fileName[i]; // ชื่อไฟล์จาก req.body
                        const newPath = `${folderPath}/file/${fileName}`;
                        console.log("old ",oldPath)
                        console.log("newPath ",newPath)
                        const result = await cloudinary.uploader.upload(filePath, {
                            resource_type: "auto",
                            folder: `${folderFile}`,
                            public_id: fileName, // ใช้ชื่อไฟล์ที่กำหนด
                        });
                        // await cloudinary.uploader.destroy(`${oldPath}`);
                    }
                }
            } catch (error) {
                console.error(`เกิดข้อผิดพลาดในการอัปโหลดงาน ${obj.id_assignment}`, error.message);
            }
        }
        const io = req.app.get("io");
        if (io && Array.isArray(idRoomArray)) {
            io.sockets.sockets.forEach((socket) => {
                const userRooms = socket.data.rooms || []; // 🔥 ดึงห้องที่ socket join ไว้
                const matchedRooms = idRoomArray.filter((roomId) =>
                    userRooms.includes(String(roomId))
                );
        
                if (matchedRooms.length > 0) {
                    console.log(`Broadcasting to matched rooms: ${matchedRooms}`);
                    matchedRooms.forEach((roomId) => {
                        io.to(String(roomId)).emit("activityStudent");
                    });
                }
            });
        }
        return res.json({status: 'success', message:'Assignment saved!'});
    }
    catch(error){
        console.log(error);
        return res.json({ status:'error',message: error.message });
    }
}

exports.list_assignments = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies.token
        console.log(token)
        const role = jwt.verify(token, process.env.JWT_SECRET);
        console.log(role.role)
        if(role.role == 'studens'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT 
                a.title,
                a.due_time,
                w.id_assignment,
                SUM(CASE WHEN w.is_submitted = TRUE THEN 1 ELSE 0 END) AS true_count,
                COUNT(w.is_submitted) AS all_count
                FROM assignment AS a
                LEFT JOIN work AS w ON a.id = w.id_assignment
                WHERE a.id_classroom = $1
                GROUP BY a.id, a.title, a.due_time, w.id_assignment
                ORDER BY a.id DESC`
        const result = await db.query(querySql, [id]);
        // console.log(result.rows);
        return res.json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.page_post_assignments = async (req, res) => {
    try {
        const { id } = req.params;
        const querySql = `SELECT 
                a.title,
                a.due_time,
                a.id AS id_assignment,
                a.create_at
                FROM assignment AS a
                WHERE a.id_classroom = $1`
        const result = await db.query(querySql, [id]);
        // console.log(result.rows);
        return res.json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.detail_assignment = async (req, res) => {
    try {
        const {assignmentId} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        let querySql
        const queryCheckIdwork = `SELECT a.assignment_type FROM assignment AS a WHERE a.id = $1`
        const resultCheckIdwork = await db.query(queryCheckIdwork, [assignmentId])
        if(resultCheckIdwork.rows[0].assignment_type === 'group'){
            querySql = `SELECT w.sent_date,a.assignment_type,w.id,a.score,w.id_group,g.name AS group_name,a.title,a.due_time,a.colses_time,w.is_submitted,w.work,STRING_AGG(u.fname || ' ' || u.lname, ', ') AS group_members FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
			INNER JOIN groups AS g ON g.id = w.id_group
			LEFT JOIN groups_member AS gm ON gm.id_group = g.id
			INNER JOIN users AS u ON u.id = gm.id_user
            WHERE a.id = $1 AND w.verify = false
			GROUP BY w.id,a.id,w.is_submitted,w.id_group,g.id,w.work,w.sent_date`
        }
        else{
            querySql = `SELECT w.sent_date,a.assignment_type,w.id,a.score,w.id_user,a.title,a.due_time,a.colses_time,u.fname,u.lname,w.is_submitted,w.work FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN users AS u ON u.id = w.id_user
            WHERE a.id = $1 AND w.verify = false`
        }
        const result = await db.query(querySql, [assignmentId])
        return res.json({assignment_type:resultCheckIdwork.rows[0].assignment_type,data:result.rows});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.verified_assignment = async (req, res) => {
    try {
        const {assignmentId} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        let querySql
        const queryCheckIdwork = `SELECT a.assignment_type FROM assignment AS a WHERE a.id = $1`
        const resultCheckIdwork = await db.query(queryCheckIdwork, [assignmentId])
        if(resultCheckIdwork.rows[0].assignment_type === 'group'){
            querySql = `SELECT a.assignment_type,w.feedback,w.score AS wscore,a.score AS ascore,w.id,w.id_group,g.name AS group_name,a.title,a.due_time,a.colses_time,w.is_submitted,w.work,STRING_AGG(u.fname || ' ' || u.lname, ', ') AS group_members FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
			INNER JOIN groups AS g ON g.id = w.id_group
			LEFT JOIN groups_member AS gm ON gm.id_group = g.id
			INNER JOIN users AS u ON u.id = gm.id_user
            WHERE a.id = $1 AND w.verify = true
			GROUP BY w.id,a.id,w.is_submitted,w.id_group,g.id,w.work,w.score,w.feedback`
        }
        else{
            querySql = `SELECT w.feedback,w.id,w.score AS wscore,a.score AS ascore,w.id_user,a.title,a.due_time,a.colses_time,u.fname,u.lname,w.is_submitted,w.work FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN users AS u ON u.id = w.id_user
            WHERE a.id = $1 AND w.verify = true`
        }
        const result = await db.query(querySql, [assignmentId])
        return res.json({assignment_type:resultCheckIdwork.rows[0].assignment_type,data:result.rows});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.all_up_comming = async (req, res) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.id_user FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND CURRENT_TIMESTAMP < a.due_time AND w.is_submitted = false 
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.all_past_due = async (req, res) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.is_submitted,a.colses_time FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND w.is_submitted = false AND CURRENT_TIMESTAMP > a.due_time 
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.all_completed = async (req, res) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.sent_date FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND w.is_submitted = true
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.up_comming = async (req, res) => {
    try{
        const {id,id_classroom} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND CURRENT_TIMESTAMP < a.due_time AND a.id_classroom = $2 AND w.is_submitted = false 
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id,id_classroom])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.completed = async (req, res) => {
    try{
        const {id,id_classroom} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.sent_date FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND w.is_submitted = true AND a.id_classroom = $2
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id,id_classroom])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.past_due = async (req, res) => {
    try{
        const {id,id_classroom} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.is_submitted,a.colses_time FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND w.is_submitted = false AND CURRENT_TIMESTAMP > a.due_time AND a.id_classroom = $2
            ORDER BY a.due_time DESC`
        const result = await db.query(querySql,[id,id_classroom])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.activity = async (req,res,io) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        const io = req.app.get("io");
        const querySql = `SELECT 
                a.id,
                a.title,
                a.due_time,
                w.id ,
                w.id_group,
                w.id_user ,
                c.name ,
                u.fname ,
                u.lname,
                w.activity,
                a.assignment_type
            FROM 
                assignment AS a
            INNER JOIN 
                work AS w ON w.id_assignment = a.id
            INNER JOIN 
                classroom AS c ON c.id = a.id_classroom
            INNER JOIN 
                users AS u ON u.id = c.id_user
            INNER JOIN 
                members AS m ON m.id_classroom = a.id_classroom
            LEFT JOIN 
                groups_member AS gm ON gm.id_group = w.id_group
            WHERE 
                (w.id_user = $1 OR gm.id_user = $1)
                AND m.id_user = $1
                AND ((a.create_at >= now() - interval '15 day' AND w.activity <> 'No' AND w.activity <> 'Initia') 
                OR (w.activity = 'No' OR w.activity = 'Initia'))
            ORDER BY 
                a.id DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.activity_group = async (req,res) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'teacher' || role.role === 'admin'){
            return res.sendStatus(403);
        }
        // console.log(id)
        const querySql = `SELECT 
                a.title,
                w.id,
                a.due_time,
                c.name AS classroom_name,
                w.id AS work_id,
                STRING_AGG(u.fname || ' ' || u.lname, ', ') AS group_members,
                w.id_group
            FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
            INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            INNER JOIN groups_member AS gm ON gm.id_group = w.id_group
            INNER JOIN users AS u ON u.id = gm.id_user
            WHERE 
                m.id_user = $1 -- ตรวจสอบว่าเป็นสมาชิกในห้องเรียน
                AND gm.id_group IN (
                    SELECT gm.id_group
                    FROM groups_member AS gm
                    WHERE gm.id_user = $1
                )
            GROUP BY 
                a.title, 
                a.due_time, 
                c.name, 
                w.id_group, 
                a.id, 
                w.id
            ORDER BY 
                a.id DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.activity_teacher = async (req,res) => {
    try{
        const {id} = req.params
        const token = req.cookies.token
        console.log(token)
        const role = jwt.verify(token, process.env.JWT_SECRET);
        console.log(role.role)
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        const querySql  = `SELECT 
            w.id_assignment,
            a.id_classroom,
            COUNT(*) AS submissionCount,
            a.assignment_type,
            c.name,
            w.id,
            a.title,
            CASE 
            WHEN SUM(CASE WHEN w.activity = 'InitialT' THEN 1 ELSE 0 END) > 0 THEN 'InitialT'
            WHEN SUM(CASE WHEN w.activity = 'NoT' THEN 1 ELSE 0 END) > 0 THEN 'NoT'
            WHEN SUM(CASE WHEN w.activity = 'ViewedT' THEN 1 ELSE 0 END) > 0 THEN 'ViewedT'
            ELSE 'NoT'
            END AS activity,
            MAX(w.sent_date) AS latest_sent_date
        FROM work AS w
        INNER JOIN assignment AS a ON a.id = w.id_assignment
        INNER JOIN classroom AS c ON c.id = a.id_classroom
        WHERE c.id_user = $1
        AND w.is_submitted = true
        GROUP BY 
            w.id_assignment,
            a.id_classroom,
            a.assignment_type,
            c.name,
            w.id,
            a.title
        ORDER BY latest_sent_date DESC`
        const result = await db.query(querySql,[id])
        // console.log(result.rows)
        return res.json(result.rows)
    }
    catch (error) {
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
        const { id_assignment,id} = req.params;
        console.log(id_assignment);
        let totalSize = 0
        // const directoryPath = path.join(__dirname, '../assignments', id_assignment,id, 'file');
        // assignments/569/5/file
        const directoryPath = `assignments/${id_assignment}/${id}/file`
        console.log("directoryPath ",directoryPath)
        const resources = await cloudinary.api.resources({
            prefix: directoryPath,   
            max_results: 500,     
            type: 'upload',
        });
        if (resources.resources.length === 0) {
            console.log("ไม่พบไฟล์ในโฟลเดอร์นี้");
        } else {
            totalSize = resources.resources.reduce((sum, file) => sum + file.bytes, 0);
        }
        console.log('totalSize ',totalSize)
        // รวมขนาดไฟล์ทั้งหมด
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
exports.check_type_file = async (req, res) => {
    try {
        const { id_assignment, workId, fileName } = req.params;
        // const filePath = path.join(__dirname, '../assignments', id_assignment, workId,'file', fileName);
        // console.log(filePath);
        // return res.sendFile(filePath)
        const fileExtension = fileName.split('.').pop();
        const fileUrl = `https://res.cloudinary.com/${process.env.YOUR_CLOUD_NAME}/${fileExtension === 'docx' || fileExtension === 'xlsx' || fileExtension === 'txt' ? 'raw' : 'image'}/upload/assignments/${id_assignment}/${workId}/file/${fileName}${fileExtension === 'docx' || fileExtension === 'xlsx' || fileExtension === 'txt' ? '' : `.${fileExtension}`}`
        console.log(fileUrl)
        return res.redirect(fileUrl);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
}


exports.data_assignment = async (req, res) => {
    try {
        const {id_assignment} = req.params
        const querySql = `SELECT w.id,a.title,a.instructions,a.reference_files,a.score,a.due_time,a.colses_time,a.assignment_type,c.name FROM assignment AS a
            INNER JOIN classroom AS c ON c.id = a.id_classroom
            INNER JOIN work AS w ON w.id_assignment = a.id 
            WHERE a.id = $1`;
        const result = await db.query(querySql, [id_assignment])
        return res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_sheet = async (req, res) => {
    try {
        const {id_work,fileName,id_assignment} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        console.log(id_work, fileName, id_assignment)
        const folderFile = decodeURIComponent(`assignments/${id_assignment}/${id_work}/file/${fileName}`);
        const file = 'SELECT reference_files FROM assignment WHERE id = $1'
        // }
        const sqlFileName = await db.query(file,[id_assignment])
        let existingFileNames = [];
        if (sqlFileName.rows[0].reference_files) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].reference_files);
        }
        existingFileNames = existingFileNames.filter(f => f !== fileName);
        const filterFileName = existingFileNames.length > 0 ? JSON.stringify(existingFileNames) : null;
        console.log(filterFileName)
        const upadteFile = 'UPDATE assignment SET reference_files = $1 WHERE id = $2'
        await db.query(upadteFile,[filterFileName,id_assignment])
        const fileExtension = fileName.split('.').pop();
        const resourceType = ["docx", "xlsx", "txt"].includes(fileExtension) ? "raw" : "image";
        const result = await cloudinary.api.resource(folderFile, { resource_type: resourceType });
        
        await cloudinary.api.delete_resources([result.public_id], { resource_type: result.resource_type });
        // const resources = await cloudinary.api.resources_by_ids([folderFile]);
        // console.log('folderFile ',folderFile)
        // for (const file of resources.resources) {
        //     await cloudinary.api.delete_resources([file.public_id], { resource_type: file.resource_type });
        //     console.log(`ลบไฟล์สำเร็จ: ${file.public_id} (${file.resource_type})`);
        // }
        // fs.unlinkSync(folderFile)
        return res.json({status: 'success'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_assignment = async(req,res) => {
    try {
        const {title,instructions,score,due_time,colses_time,assignmentId,fileName,workId} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        if(fileName !== 'null'){
            for(let i=0 ;i < fileName.length;i++){
                const curentFile = fileName[i]
                console.log("curentFile ",curentFile.length)
                if(curentFile.length > 200){
                    return res.json({status:'errors', message:'File name is longer than 200 characters.'});
                }
            }
            
        }
        console.log("colses_time ",colses_time)
        let filterFileName = null;
        let sqlFileName = await db.query('SELECT reference_files FROM assignment WHERE id = $1',[assignmentId])
        console.log("fileName ",fileName)
        let referenceFiles = JSON.parse(sqlFileName.rows[0].reference_files || '[]');
        if(fileName){
            if (Array.isArray(fileName)) {
                referenceFiles = [...referenceFiles, ...fileName]; // รวมไฟล์จาก fileName เข้ากับ referenceFiles
            } else {
                referenceFiles.push(fileName); // เพิ่มไฟล์เดียวเข้าไป
            }
        }
        filterFileName = referenceFiles.length > 0 ? JSON.stringify(referenceFiles):null;
        console.log("filterFileName ",filterFileName)
        const due_DateTime = new Date(due_time)
        const dueDateTime = `${due_DateTime.getFullYear()}-${(due_DateTime.getMonth() + 1).toString().padStart(2, '0')}-${due_DateTime.getDate().toString().padStart(2, '0')} ${due_DateTime.getHours().toString().padStart(2, '0')}:${due_DateTime.getMinutes().toString().padStart(2, '0')}:00`
        let closeDate_Time = null;
        if(colses_time !== 'null'){
            const closeDateTime = new Date(colses_time);
            closeDate_Time = `${closeDateTime.getFullYear()}-${(closeDateTime.getMonth() + 1).toString().padStart(2, '0')}-${closeDateTime.getDate().toString().padStart(2, '0')} ${closeDateTime.getHours().toString().padStart(2, '0')}:${closeDateTime.getMinutes().toString().padStart(2, '0')}:00`;
        }
        const updateAssignment = 'UPDATE assignment SET title=$1, instructions=$2, score=$3, due_time=$4, colses_time=$5, reference_files=$6 WHERE id=$7'
        await db.query(updateAssignment,[title,instructions,score,dueDateTime,closeDate_Time,filterFileName,assignmentId])

        if (req.files && req.body) {
            try {
                for (let i = 0; i < req.files.length; i++) {
                    const folderFile = `assignments/${assignmentId}/${workId}`
                    const file = req.files[i];
                    const fileName = req.body.fileName[i]; // ชื่อไฟล์จาก req.body
                    const filePath = file.path; // ตำแหน่งไฟล์ชั่วคราวบนเซิร์ฟเวอร์
    
                    console.log(`กำลังอัปโหลดไฟล์: ${filePath}`);
                    const result = await cloudinary.uploader.upload(filePath, {
                        resource_type: "auto",
                        folder: `${folderFile}/file`,
                        public_id: fileName, // ใช้ชื่อไฟล์ที่กำหนด
                    });
                }
            } catch (error) {
                console.log(error)
            }
        }
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.remember_groups = async(req,res) => {
    try {
        const {classroomId} = req.params
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        const querySql = `SELECT gr.id_user,gr.no_group,gr.name FROM groups_remember AS gr
        WHERE gr.id_classroom = $1`
        const result = await db.query(querySql,[classroomId])
        console.log(result.rows)
        return res.json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_assignment = async(req,res) => {
    try {
        const {assignmentId,assignment_type} = req.body
        const token = req.cookies.token
        const role = jwt.verify(token, process.env.JWT_SECRET);
        if(role.role === 'studens'){
            return res.sendStatus(403);
        }
        console.log(assignmentId, assignment_type)
        if(assignment_type === 'group'){

            const queryIdGroup = `SELECT w.id_group FROM assignment AS a
                INNER JOIN work AS w ON w.id_assignment = a.id
                WHERE a.id = $1`
            const findIdGroup = await db.query(queryIdGroup,[assignmentId])
            await db.query('DELETE FROM work WHERE work.id_assignment = $1',[assignmentId])
            if(findIdGroup.rows.length > 0){
                const deleteGroupmember = 'DELETE FROM groups_member WHERE id_group = $1'
                await Promise.all(
                    findIdGroup.rows.map(async (group) => {
                        await db.query(deleteGroupmember,[group.id_group])
                        // console.log(group.id_group)
                    })
                )
                const deleteGroup = 'DELETE FROM groups WHERE id = $1'
                await Promise.all(
                    findIdGroup.rows.map(async (group) => {
                        await db.query(deleteGroup,[group.id_group])
                        // console.log(group.id_group)
                    })
                )
            }
        }
        else{
            await db.query('DELETE FROM work WHERE work.id_assignment = $1',[assignmentId])
        }
        await db.query('DELETE FROM assignment WHERE assignment.id = $1',[assignmentId])
        
        const folderPath = `assignments/${assignmentId}`
        console.log('path ',folderPath)
        try {
            const resourceTypes = ['image', 'raw'];
            for (const type of resourceTypes) {
            await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: type });
            }
            await cloudinary.api.delete_folder(folderPath ,{ resource_type: 'auto' });
            console.log(`deleted successfully.`);
        }
        catch (err) {
            console.log('Error deleting folder:', err);
        }
        return res.json({status:'success'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}