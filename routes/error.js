const express = require("express")
const router = express.Router()

router.all("*", (req, res, next)=>{
    res.status(500)
    res.json({msg: "An error has occured, please try again later"})
} )

module.exports = router