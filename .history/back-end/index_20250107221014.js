const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const app = express()
const auth = require('./Routes/auth')
const classroom = require('./Routes/classroom')
const assignment = require('./Routes/assignments')
const work = require('./Routes/works')
const cors = require("cors")
const { config } = require('dotenv')

app.use(
  cors({
    credentials: true,
  }),
);
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

app.listen(4444,()=>{
    console.log('Server is running on port 4444')  
})