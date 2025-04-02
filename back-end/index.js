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

app.use(cors({
  origin: process.env.FRONTEND_PORT,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_PORT, // อนุญาตทุกโดเมน (ปรับตามความเหมาะสม)
        methods: ["GET", "POST", "PUT", "DELETE"],
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


// ใช้ server.listen แทน app.listen
server.listen(4444, () => {
  console.log("Server is running on port 4444");
});
// app.listen(4444,()=>{
//     console.log('Server is running on port 4444')  
// })