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
        const id_post = Promise.all(
            await db.query('INSERT INTO post (message,file,c)')
        )
        return res.json({status: 'success'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}