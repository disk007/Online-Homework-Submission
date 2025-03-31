const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, './files/')
    // },
    filename: function (req, file, cb) {
        // const index = file.fieldname.match(/\d+/)[0]; // ดึง index จาก fieldname เช่น file[0]
        // const customName = req.body[`test[${index}]`];
        // console.log(customName)
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
  
  // สร้าง multer instance โดยใช้ storage ที่กำหนดไว้
const upload = multer({ storage: storage });

module.exports = upload