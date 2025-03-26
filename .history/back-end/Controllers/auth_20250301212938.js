const db = require('../Model/database')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const nodemailer = require("nodemailer");
const secret = process.env.JWT_SECRET; 
const secretPassword = process.env.JWT_PASSWORD


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
exports.edit_profile = async (req, res) => {
    try {
        const {id, fname, lname} =  req.body
        const result = await db.query('UPDATE users SET fname = $1, lname = $2 WHERE id = $3', [fname, lname, id]);
        if(!result){
            return res.status(500).json({status:'error', message: 'Failed to update' });
        }
        res.status(200).json({ status:'success'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

exports.change_password = async(req,res) => {
    try {
        const {old,newPassword,id} = req.body
        const check_pass = await db.query("SELECT * FROM users WHERE id = $1",[id]);
        const match = await bcrypt.compare(old, check_pass.rows[0].password);
        if(!match){
            return res.json({ status:'invalid', message: 'Invalid old password' });
        }
        console.log(old,newPassword)
        const hash = await bcrypt.hash(newPassword, 10);
        const result = await db.query('UPDATE users SET password = $1 WHERE id = $2', [hash, id]);
        if(!result){
            return res.status(500).json({status:'error', message: 'Failed to update password' });
        }
        return res.json({status:'success'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.forgot_password = async(req, res) => {
    try {
        const {email} = req.body
        console.log(email)
        const user = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(user.rows.length === 0){
            return res.json({ status:'notFound', message: 'Email not found.' });
        }
        const token = jwt.sign({email}, secretPassword, { expiresIn: "5m" });
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          const receiver = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: `
            <div style="max-width: 500px; margin: auto; padding: 20px; 
                        border-radius: 10px; border: 1px solid #ddd; 
                        font-family: Arial, sans-serif; text-align: center;">
    
                <h2 style="color: #333;">Reset your password</h2>
    
                <p style="color: #555;">We received a request to reset your password.</p>
    
                <a href="${process.env.FRONTEND_PORT}/${token}" 
                   style="display: inline-block; padding: 12px 20px; 
                          background-color: #007bff; color: white; 
                          text-decoration: none; border-radius: 5px; 
                          font-size: 16px; font-weight: bold; margin-top: 10px;">
                    Reset Password
                </a>
    
                <p style="margin-top: 20px; color: #888; font-size: 12px;">
                    If you did not request this, please ignore this email.
                </p>
    
            </div>`
        };
        await transporter.sendMail(receiver);
        return res.json({ status:'success', message: 'We have emailed the link to you.'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.verifyTokenPass = async (req, res) => {
    try {
        const {token} = req.body
        const decoded = jwt.verify(token, secretPassword);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
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