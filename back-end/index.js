const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const app = express()
const cors = require("cors")
const http = require("http");
const { Server } = require("socket.io");
const socketHandler  = require('./Middleware/socket')
// const { config } = require('dotenv')

const server = http.createServer(app); // ใช้ http server
const io = new Server(server, {
    cors: {
        origin: "https://online-homework-submission.vercel.app", // อนุญาตทุกโดเมน (ปรับตามความเหมาะสม)
        credentials: true,
    },
});
app.set("io", io);
socketHandler(io);

const auth = require('./Routes/auth')
const classroom = require('./Routes/classroom')
const assignment = require('./Routes/assignments')
const work = require('./Routes/works')
const post = require('./Routes/post')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello')
})

app.use(auth)
app.use(classroom)
app.use(assignment)
app.use(work)
app.use(post)

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("joinRoom", (id) => {
//     socket.join(id);
//     console.log(`User joined room: ${id}`);
    
//     // ส่งข้อมูลไปยังห้องที่ user อยู่
//     // io.to(id).emit("activity-student", data);
// });


//   socket.on("disconnect", () => {
//       console.log("User disconnected");
//   });
// });

// ใช้ server.listen แทน app.listen
server.listen(4444, () => {
  console.log("Server is running on port 4444");
});
// app.listen(4444,()=>{
//     console.log('Server is running on port 4444')  
// })