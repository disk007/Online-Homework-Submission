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
        
        const insertedIds = await Promise.all(
            idRoomFilter.map(async (d, i) => {
                const result = await db.query(
                    'INSERT INTO assignment (title, instructions, score, reference_files, due_time, colses_time, id_classroom) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                    [title, instructions, points, filterFileName, dueDateTime, closeDateTime, d]
                );
                return result.rows[0].id; // ดึง id ที่พึ่ง insert
            })
        );
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
                SUM(CASE WHEN w.is_submitted = FALSE THEN 1 ELSE 0 END) AS false_count
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
        const querySql = `SELECT a.title,a.due_time,a.colses_time,u.fname,u.lname,w.is_submitted FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
            INNER JOIN users AS u ON u.id = w.id_user
            WHERE a.id = $1`
        const result = await db.query(querySql, [assignmentId])
        console.log(result.rows)
        return res.json(result.rows);
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
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE w.id_user = $1 AND CURRENT_TIMESTAMP < a.due_time AND m.id_user = $1
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
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE w.id_user = $1 AND w.is_submitted = false AND CURRENT_TIMESTAMP > a.due_time AND m.id_user = $1
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
			INNER JOIN members AS m ON m.id_classroom = a.id_classroom
            WHERE w.id_user = $1 AND w.is_submitted = true AND m.id_user = $1
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
            WHERE w.id_user = $1 AND CURRENT_TIMESTAMP < a.due_time AND a.id_classroom = $2
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
            WHERE w.id_user = $1 AND w.is_submitted = true AND a.id_classroom = $2
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
            WHERE w.id_user = $1 AND w.is_submitted = false AND CURRENT_TIMESTAMP > a.due_time AND a.id_classroom = $2
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
        const querySql = `SELECT a.title,a.due_time,w.id,c.name,u.fname,u.lname FROM assignment AS a
            INNER JOIN work AS w ON w.id_assignment = a.id
			INNER JOIN classroom AS c ON c.id = a.id_classroom
			INNER JOIN users AS u ON u.id = c.id_user
            WHERE w.id_user = $1
            ORDER BY a.id DESC`
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
        console.log(filePath);
        return res.sendFile(filePath)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
