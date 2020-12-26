const express = require("express")
const {hashPassword, createCookie, generateNewToken} = require("../identifyUser")
const {checkHashedPassword} = require("../identifyUser")
const asyncHandler = require("../asyncHandler")

const {Researcher} = require("../db/models")
const researchingRouter = require("./researching")

const router = express.Router()

router.use("/researching", researchingRouter)

router.get("/token", (req, res)=>{
    console.log(req.user)
    if(!req.user){
        res.json({msg:"Token not autheticated"})
        return
    }

    res.json({id: req.user.id, email: req.user.email, token: req.body.token})
})


router.post("/signUp", asyncHandler(async (req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password, firstName, lastName} = req.body
    console.log(password)
    console.log(hashPassword(password))
    const newPodcaster = await Researcher.create({email, firstName, lastName, hashedPassword: hashPassword(password)});
    const token = await generateNewToken(newPodcaster.id, "Researcher")
    res.json({id: newPodcaster.id, email: newPodcaster.email, token})
    return
}))

router.post("/login", asyncHandler( async(req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password} = req.body;
    const user = await Researcher.findOne({where: {email}})
    if(!user || !checkHashedPassword(password, user.hashedPassword)){
        res.json({msg: "Username or Password is incorrect"})
        return
    }
    const token = await generateNewToken(user.id, "Researcher")
    res.json({email: user.email, id: user.id, token})
}))




module.exports = router