const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const app = express()

const http = require("http");
const { Server } = require("socket.io");
const socketHandler  = require('./Middleware/socket')
// const { config } = require('dotenv')

const server = http.createServer(app); // ใช้ http server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // อนุญาตทุกโดเมน (ปรับตามความเหมาะสม)
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
const cors = require("cors")

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello Express!')
})

app.use(auth)
app.use(classroom)
app.use(assignment)
app.use(work)
app.use(post)

const data = [
  {
    id: 34,
    title: 'test groups',
    id_group: 99,
    id_user: null,
    name: 'Computer Vision CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 33,
    title: 'work last กลุ่ม',
    id_group: 95,
    id_user: null,
    name: 'Computer Programing CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 32,
    title: 'เขียนโปรแกรมตามโจทย์',
    id_group: null,
    id_user: 5,
    name: 'Computer Programing CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 31,
    title: 'gmlit[[',
    id_group: null,
    id_user: 5,
    name: 'Computer Vision CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 30,
    title: 'งานกลุ่ม',
    id_group: 71,
    id_user: null,
    name: 'Computer Programing CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 29,
    title: 'project group last',
    id_group: 68,
    id_user: null,
    name: 'Computer Programing CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 26,
    title: 'start1',
    id_group: null,
    id_user: 5,
    name: 'Data minning ',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 25,
    title: 'start',
    id_group: null,
    id_user: 5,
    name: 'Data minning ',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 24,
    title: 'mama',
    id_group: null,
    id_user: 5,
    name: 'Data minning ',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 23,
    title: 'ggder',
    id_group: null,
    id_user: 5,
    name: 'Computer Vision CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 22,
    title: 'test หลายกลุ่มเรียน',
    id_group: null,
    id_user: 5,
    name: 'Data minning ',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  },
  {
    id: 21,
    title: 'test หลายกลุ่มเรียน',
    id_group: null,
    id_user: 5,
    name: 'Computer Vision CPE.65231',
    fname: 'witchaphon',
    lname: 'seanthawisuk'
  }
]
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