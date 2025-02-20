const db = require('../Model/database')
const fs = require('fs');
const path = require('path');
exports.add_assignments = async (req,res) => {
    try{
        const {title,instructions,points,dueDate,dueTime,idClassroom,typeWork,members,dateClose,timeClose,fileName} = req.body
        let filterFileName = null;
        if(fileName){
            filterFileName = JSON.stringify(fileName);
        }
        const due_Date = new Date(dueDate)
        const due_Time = new Date(dueTime)

        const dueDateTime = `${due_Date.getFullYear()}-${(due_Date.getMonth() + 1).toString().padStart(2, '0')}-${due_Date.getDate().toString().padStart(2, '0')} ${due_Time.getHours().toString().padStart(2, '0')}:${due_Time.getMinutes().toString().padStart(2, '0')}:00`
        console.log("dueDateTime "+dueDateTime)
        let closeDateTime = null;
        if(dateClose !== "" && timeClose !== ""){
            const closeDate = new Date(dateClose);
            const closeTime = new Date(timeClose);
            const close_Date = `${closeDate.getFullYear()}-${(closeDate.getMonth() + 1).toString().padStart(2, '0')}-${closeDate.getDate().toString().padStart(2, '0')}`;
            const close_Time = `${closeTime.getHours().toString().padStart(2, '0')}:${closeTime.getMinutes().toString().padStart(2, '0')}:00`;
            closeDateTime = `${close_Date} ${close_Time}`
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
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'All students']
                    );
                    return result.rows[0].id; // ดึง id ที่พึ่ง insert
                })
            );
        }
        else if(typeWork === 'Individual students'){
            insertedIds = await Promise.all(
                idRoomFilter.map(async (d, i) => {
                    const result = await db.query(
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'Individual students']
                    );
                    return result.rows[0].id; // ดึง id ที่พึ่ง insert
                })
            );
        }
        else if(typeWork === 'groups'){
            insertedIds = await Promise.all(
                idRoomFilter.map(async (d, i) => {
                    const result = await db.query(
                        'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom,assignment_type) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING id',
                        [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d,'group']
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
                    Promise.all(
                        group.members.map(async (member) => {
                            await db.query("INSERT INTO groups_member (id_user,id_group) VALUES ($1,$2)",[member.id_user,id.rows[0].id])
                        })
                    )
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

            insertIdWorks = [...new Set(insertIdWorks)];// แสดงผล id ทั้งหมด
            idAssignmentWork = await Promise.all(
                insertIdWorks.map(async(data)=>{
                    console.log("data "+data)
                    const result = await db.query(`SELECT id, id_group, id_assignment FROM work WHERE id = $1 `,[data])
                    return result.rows;
                })
            ) 
        }

        idAssignmentWork.flatMap(sub => {
            sub.map(obj => {
                const Path = path.join(__dirname,'../assignments',obj.id_assignment.toString(),obj.id.toString(),typeWork === "groups"?obj.id_group.toString():obj.id_user.toString())
                fs.mkdirSync(Path, { recursive: true })
                console.log('Folder created successfully!')
                if (req.files && req.body) {
                    req.files.forEach((file, index) => {
                        console.log("file.path "+file.path)
                        console.log(file, fileName[index])
                        const folderFile = path.join(__dirname,'../assignments',obj.id_assignment.toString(),obj.id.toString(),'file');
                        if (!fs.existsSync(folderFile)) {
                            try {
                                fs.mkdirSync(folderFile, { recursive: true })
                                console.log(`Folder created: ${folderFile}`);
                            } catch (err) {
                                console.error('Error creating folder:', err);
                            }
                        }
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
            }) 
        })
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
        return res.json({status: 'success', message:'Assignment saved!'});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.list_assignments = async (req, res) => {
    try {
        const { id } = req.params;
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
        return res.json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.detail_assignment = async (req, res) => {
    try {
        const {assignmentId} = req.params
        let querySql
        const queryCheckIdwork = `SELECT a.assignment_type FROM assignment AS a WHERE a.id = $1`
        const resultCheckIdwork = await db.query(queryCheckIdwork, [assignmentId])
        if(resultCheckIdwork.rows[0].assignment_type === 'group'){
            querySql = `SELECT a.assignment_type,w.id,a.score,w.id_group,g.name AS group_name,a.title,a.due_time,a.colses_time,w.is_submitted,w.work,STRING_AGG(u.fname || ' ' || u.lname, ', ') AS group_members FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
			INNER JOIN groups AS g ON g.id = w.id_group
			LEFT JOIN groups_member AS gm ON gm.id_group = g.id
			INNER JOIN users AS u ON u.id = gm.id_user
            WHERE a.id = $1 AND w.verify = false
			GROUP BY w.id,a.id,w.is_submitted,w.id_group,g.id,w.work`
        }
        else{
            querySql = `SELECT a.assignment_type,w.id,a.score,w.id_user,a.title,a.due_time,a.colses_time,u.fname,u.lname,w.is_submitted,w.work FROM assignment AS a
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
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,w.id_user FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
			LEFT JOIN groups_member AS gm ON gm.id_group = w.id_group
            WHERE (w.id_user = $1 OR gm.id_user= $1) AND m.id_user = $1 AND CURRENT_TIMESTAMP< a.due_time AND w.is_submitted = false 
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

exports.activity = async (req,res) => {
    try{
        const {id} = req.params
        console.log(id)
        const querySql = `SELECT 
                a.id,
                a.title,
                a.due_time,
                w.id ,
                w.id_group,
                w.id_user ,
                c.name ,
                u.fname ,
                u.lname 
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
            ORDER BY 
                a.id DESC;`
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
        console.log(id)
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
        const querySql = `SELECT a.title,w.id,c.name,u.fname,u.lname,w.sent_date FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
			INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = w.id_user
            WHERE c.id_user = $1 AND w.is_submitted = true
            ORDER BY w.sent_date DESC`
        const result = await db.query(querySql,[id])
        return res.json(result.rows)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.check_type_file = async (req, res) => {
    try {
        const { id_assignment, workId, fileName } = req.params;
        const filePath = path.join(__dirname, '../assignments', id_assignment, workId,'file', fileName);
        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        // console.log(filePath);
        return res.sendFile(filePath)
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
        console.log(result.rows[0])
        return res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.delete_sheet = async (req, res) => {
    try {
        const {id_work,fileName,id_assignment} = req.body
        console.log(id_work, fileName, id_assignment)
        const folderFile = path.join(__dirname,'../assignments',id_assignment,id_work,'/file',fileName);
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
        fs.unlinkSync(folderFile)
        return res.json({status: 'success'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.update_assignment = async(req,res) => {
    try {
        const {title,instructions,score,due_time,colses_time,assignmentId,fileName} = req.body
        // console.log(title)
        // console.log(instructions)
        // console.log(score)
        // console.log(due_time)
        // console.log(colses_time)
        // console.log(assignmentId)
        let filterFileName = null;
        // if(fileName){
        //     filterFileName = JSON.stringify(fileName);
        // }
        let sqlFileName = await db.query('SELECT reference_files FROM assignment WHERE id = $1',[assignmentId])
        let referenceFiles = JSON.parse(sqlFileName.rows[0].reference_files || '[]');
        if(fileName){
            referenceFiles.push(fileName);
            filterFileName = JSON.stringify(referenceFiles);
        }
        console.log("filterFileName "+sqlFileName)
        const due_DateTime = new Date(due_time)
        const dueDateTime = `${due_DateTime.getFullYear()}-${(due_DateTime.getMonth() + 1).toString().padStart(2, '0')}-${due_DateTime.getDate().toString().padStart(2, '0')} ${due_DateTime.getHours().toString().padStart(2, '0')}:${due_DateTime.getMinutes().toString().padStart(2, '0')}:00`

        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}