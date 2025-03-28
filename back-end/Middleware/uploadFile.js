const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './files/')
//     },
//     filename: function (req, file, cb) {
//         // const index = file.fieldname.match(/\d+/)[0]; // ดึง index จาก fieldname เช่น file[0]
//         // const customName = req.body[`test[${index}]`];
//         // console.log(customName)
//         const fileName = `${Date.now()}-${file.originalname}`
//         cb(null, fileName)
//     }
// })
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // ใช้ Cloudinary ที่ตั้งค่าไว้
    params: {
      folder: 'files', // โฟลเดอร์ที่จะเก็บไฟล์ใน Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'], // รูปแบบไฟล์ที่อนุญาต
      public_id: (req, file) => `${Date.now()}-${file.originalname}`, // กำหนดชื่อไฟล์
    },
  });
  
  // สร้าง multer instance โดยใช้ storage ที่กำหนดไว้
const upload = multer({ storage: storage });

module.exports = upload