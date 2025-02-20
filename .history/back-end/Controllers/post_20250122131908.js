const db = require('../Model/database')
const fs = require('fs');
const path = require('path');

exports.add_post = async (req, res) =>{
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}