const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const cors = require("cors")
const bearer = require("express-bearer-token")
const d = require("dotenv").config()
const {identifyUser} = require("./identifyUser")

const addTokenAsCookie = (req, res, next) =>{
    if(req.body.token){
        req.cookies = {loginToken: req.body.token}
    }
    next()
    return
}

const indexRouter = require("./routes")

const app = express();

const corsOptions = {origin: "*"};
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(addTokenAsCookie)
app.use(identifyUser)



app.use("/", indexRouter)

app.listen(5000, ()=>console.log("Listening on port 5000"))
//error handlers