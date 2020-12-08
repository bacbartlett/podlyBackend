const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const indexRouter = require("./routes")

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/", indexRouter)

app.listen(5000, ()=>console.log("Listening on port 5000"))
//error handlers