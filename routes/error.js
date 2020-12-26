const express = require("express")
const router = express.Router()

router.all("*", (req, res, next)=>{
    res.json({msg: "An error has occured, please try again later"})
} )

module.exports = router