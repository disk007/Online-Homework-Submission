const db = require('../Model/database')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const secret = process.env.JWT_SECRET; 


exports.register_teacher = async (req, res) => {
    try{
        const {fname,lname,email,password,number_teacher} = req.body;
        const number = await db.query('SELECT id FROM number_teacher WHERE number = $1',[number_teacher])
        if(number.rows.length>0){
            const check_number = await db.query('SELECT id_number_teacher FROM users WHERE id_number_teacher = $1',[number.rows[0].id]);
            const hash = await bcrypt.hash(password, 10);
            if(check_number.rows.length>0){
                return res.json({ status:'duplicate',message: 'Number already registered as teacher' });
            }
            // const userInsert = await db.query('INSERT INTO users (role,email,password) VALUES ($1,$2,$3) RETURNING id', ['teacher',email,hash]);

            // // Get the id of the inserted user
            // const id_user = userInsert.rows[0].id;
            const result = await db.query('INSERT INTO users (fname,lname,email,password,role,id_number_teacher) VALUES ($1,$2,$3,$4,$5,$6)',[fname,lname,email,hash,'teacher',number.rows[0].id]);
            if(!result){
                return res.status(500).json({status:'error', message: 'Failed to register' });
            }
            res.status(200).json({ status: 'success'});
        }
        else{
            return res.json({status:'error', message: 'Invalid number' });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

exports.register_student = async (req, res) => {
    try{
        const {fname,lname,email,password} = req.body;
        const check_email = await db.query('SELECT email FROM users WHERE email = $1',[email]);
        const hash = await bcrypt.hash(password, 10);
        if(check_email.rows.length>0){
            return res.json({ status:'duplicate',message: 'The email already exists.' });
        }
        const result = await db.query('INSERT INTO users (fname,lname,email,password,role) VALUES ($1,$2,$3,$4,$5)',[fname,lname,email,hash,'student']);
        if(!result){
            return res.status(500).json({status:'error', message: 'Failed to register' });
        }
        res.status(200).json({ status: 'success'});
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    
    try {
        const {email,password} = req.body;
        const check_user = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(check_user.rows.length === 0){
            return res.json({status: 'error', message: "Invalid email or password" });
        }
        const user = check_user.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.json({status: 'error', message: "Invalid email or password" });
        }
        const token = jwt.sign({email}, secret, { expiresIn: "1d" });
        res.cookie("token", token, {
            maxAge: 86400000,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        return res.json({status:'success'});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', error: error.message });
    }
}

exports.profile = async (req, res) => {
    try {
      // Get the users
        const email = req.user.email;
        const results = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if(results){
            return res.json({id: results.rows[0].id, fname:results.rows[0].fname,lname:results.rows[0].lname, role:results.rows[0].role}); 
        }
        else{
            return res.status(404).json({ error: error.message });
        }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    }
}
exports.logout = async (req, res) => {
    try{
        console.log("logout");
        res.clearCookie("token", {
            httpOnly: true,  
            sameSite: "none",  
            secure: true  
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}