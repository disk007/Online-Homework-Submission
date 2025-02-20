const db = require('../Model/database')
const fs = require('fs');
const path = require('path');

exports.add_post = async (req, res) =>{
    try {
        const {date,id_user,id_classroom,message,fileName} = req.body;
        console.log(id_user)
        console.log(id_classroom)
        console.log(message)
        console.log(fileName)
        const convertDate = new Date(date)
        let filterFileName = null
        if(fileName !== 'null'){
            filterFileName = JSON.stringify(fileName);
        }
        const curentDate = `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1).toString().padStart(2, '0')}-${convertDate.getDate().toString().padStart(2, '0')} ${convertDate.getHours().toString().padStart(2, '0')}:${convertDate.getMinutes().toString().padStart(2, '0')}:00`
        console.log(curentDate)
        const id_post =  await db.query('INSERT INTO post (message,file,create_at,id_user,id_classroom) VALUES ($1,$2,$3,$4,$5) RETURNING id',[message,filterFileName,convertDate,id_user,id_classroom])
        
        if (req.files && req.body) {
            const Path = path.join(__dirname,'../post',id_post.rows[0].id.toString())
            fs.mkdirSync(Path, { recursive: true })
            req.files.forEach((file, index) => {
                console.log("file.path "+file.path)
                console.log(file, fileName[index])
                // const folderFile = path.join(__dirname,'../post',result.rows[0].id_assignment.toString(),id_work.toString(),resultCheckType.rows[0].assignment_type === 'group' ? resultCheckType.rows[0].id_group.toString() : id_user.toString());
                const newPath = path.join(Path,fileName[index]);
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

        return res.json({status: 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.get_post = async (req, res) => {
    try {
        const {id_classroom} = req.params
        const querySql = `SELECT p.id_user,p.id, p.message, p.file, p.create_at, CONCAT(u.fname, ' ', u.lname) AS name ,u.role FROM post AS p
        INNER JOIN users AS u ON u.id = p.id_user
        WHERE p.id_classroom = $1 ORDER BY p.id DESC`
        const result = await db.query(querySql,[id_classroom])
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.add_comment = async (req, res) => {
    try {
        const {message,date,id_user,id_post} = req.body
        const convertDate = new Date(date)
        const curentDate = `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1).toString().padStart(2, '0')}-${convertDate.getDate().toString().padStart(2, '0')} ${convertDate.getHours().toString().padStart(2, '0')}:${convertDate.getMinutes().toString().padStart(2, '0')}:00`
        // console.log(curentDate)
        console.log(message,id_user,id_post)
        await db.query("INSERT INTO comment (message,create_at,id_user,id_post) VALUES ($1,$2,$3,$4)",[message,curentDate,id_user,id_post])
        return res.json({status:'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.get_comment = async (req, res) => {
    try {
        const {id_classroom} = req.params
        const querySql = `SELECT c.id_user,c.id_post,c.id,c.message,c.create_at,CONCAT(u.fname, ' ', u.lname)AS name FROM comment AS c
            INNER JOIN post AS p ON p.id = c.id_post
            INNER JOIN users AS u ON u.id = c.id_user
            WHERE p.id_classroom = $1 ORDER BY c.id DESC`
        const result = await db.query(querySql,[id_classroom])
        // console.log(result.rows)
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.data_post = async (req, res) => {
    try {
        const {id} = req.params
        const result = await db.query("SELECT id,message,file FROM post WHERE id = $1",[id])
        if(result.rows.length > 0){
            return res.json(result.rows[0])
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.edit_post = async (req, res) => {
    try {
        const {message,id,date,fileName} = req.body
        const convertDate = new Date(date)
        const curentDate = `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1).toString().padStart(2, '0')}-${convertDate.getDate().toString().padStart(2, '0')} ${convertDate.getHours().toString().padStart(2, '0')}:${convertDate.getMinutes().toString().padStart(2, '0')}:00`
        const sqlFileName = await db.query('SELECT file FROM post WHERE id = $1 ',[id])
        let result
        let existingFileNames = [];
        if (sqlFileName.rows[0].file) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].file);
        }
        if(fileName != 'null'){
            existingFileNames = [...existingFileNames, ...fileName];
            const filterFileName = JSON.stringify(existingFileNames);
            const querySql = `UPDATE post SET message = $1 , file = $2 , create_at = $3 WHERE id = $4`
            result = await db.query(querySql,[message,filterFileName,curentDate,id])
        }
        else{
            const querySql = `UPDATE post SET message = $1 , create_at = $2 WHERE id = $3`
            result = await db.query(querySql,[message,curentDate,id])
        }
        if (req.files && req.body) {
            req.files.forEach((file, index) => {
                console.log("file.path "+file.path)
                console.log(file, fileName[index])
                const newPath = path.join(__dirname,'../post',id.toString(),fileName[index]);
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
        return res.json({status: 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
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
        const { id } = req.params;
        const directoryPath = path.join(__dirname, '../post', id);
        const totalSize = calculateTotalFileSize(directoryPath);
        console.log('Total size:', totalSize);
        return res.json({ size: totalSize });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
exports.open_file = async (req, res) => {
    try {
        const {id, fileName } = req.params;
        const filePath = path.join(__dirname, '../post', id, fileName);
        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        // console.log(filePath);
        return res.sendFile(filePath)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
}
exports.delete_file_post = async (req, res) => {
    try {
        const {id,fileName} = req.body
        const folderFile = path.join(__dirname,'../post',id.toString(),fileName);
        
        
        const selectFile = 'SELECT file FROM post WHERE id = $1'
        
        const sqlFileName = await db.query(selectFile,[id])
        let existingFileNames = [];
        if (sqlFileName.rows[0].file) {
            existingFileNames = JSON.parse(sqlFileName.rows[0].file);
        }
        existingFileNames = existingFileNames.filter(f => f !== fileName);
        const filterFileName = existingFileNames.length > 0 ? JSON.stringify(existingFileNames) : null;
        const upadtefile = 'UPDATE post SET file = $1 WHERE id = $2'
        await db.query(upadtefile,[filterFileName,id])
        fs.unlinkSync(folderFile)
        return res.json({status: 'success'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.data_comment = async (req, res) => {
    try {
        const {id} = req.params
        const result = await db.query("SELECT id,message FROM comment WHERE id = $1",[id])
        if(result.rows.length > 0){
            return res.json(result.rows[0])
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.edit_comment = async (req, res) => {
    try {
        const {id,message,date} = req.body
         const convertDate = new Date(date)
        const curentDate = `${convertDate.getFullYear()}-${(convertDate.getMonth() + 1).toString().padStart(2, '0')}-${convertDate.getDate().toString().padStart(2, '0')} ${convertDate.getHours().toString().padStart(2, '0')}:${convertDate.getMinutes().toString().padStart(2, '0')}:00`
        await db.query("UPDATE comment SET message = $1,create_at = $2  WHERE id = $3",[message,curentDate,id])
        return res.json({status:'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.delete_post = async (req, res) => {
    try {
        const {id} = req.body
        await db.query("DELETE FROM comment WHERE id_post = $1",[id])
        await db.query("DELETE FROM post WHERE id = $1",[id])
        const folderFile = path.join(__dirname,'../post',id.toString());
        fs.rmSync(folderFile, { recursive: true, force: true });
        return res.json({status:'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

exports.delete_comment = async(req,res) => {
    try {
        const {id} = req.body
        await db.query("DELETE FROM comment WHERE id = $1",[id])
        return res.json({status:'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}