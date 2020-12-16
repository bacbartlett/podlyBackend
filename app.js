const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const cors = require("cors")
const bearer = require("express-bearer-token")
const d = require("dotenv").config()
const {identifyUser} = require("./identifyUser")

// const addTokenAsCookie = (req, res, next) =>{
//     console.log(req, req.cookies)
//     // if(req.body.token){
//     //     req.cookies = {loginToken: req.body.token}
//     // }
//     next()
//     return
// }

const indexRouter = require("./routes")

const app = express();
app.use(cookieParser())
const corsOptions = {origin: ["https://master.d2xwoaxs83rxad.amplifyapp.com", "http://localhost:3000"], credentials: true};
app.use(cors(corsOptions))
app.use(express.json())

app.use(morgan("dev"))
// app.use(addTokenAsCookie)
app.use(identifyUser)



app.use("/", indexRouter)
const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log("Listening on port " + port))
//error handlers