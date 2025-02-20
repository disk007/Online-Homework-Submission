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
        const querySql = `SELECT p.id, p.message, p.file, p.create_at, CONCAT(u.fname, ' ', u.lname) AS name ,u.role FROM post AS p
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
        const querySql = `SELECT c.id_post,c.id,c.message,c.create_at,CONCAT(u.fname, ' ', u.lname)AS name FROM comment AS c
            INNER JOIN post AS p ON p.id = c.id_post
            INNER JOIN users AS u ON u.id = p.id_user
            WHERE p.id_classroom = $1 ORDER BY c.id DESC`
        const result = await db.query(querySql,[id_classroom])
        // console.log(result.rows)
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}