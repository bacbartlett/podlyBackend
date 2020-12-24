const express = require("express")
const {hashPassword, createCookie, generateNewToken} = require("../identifyUser")
const {checkHashedPassword} = require("../identifyUser")

const podcastRouter = require("./podcasts")
const {Podcaster, Transcript, Podcast} = require("../db/models")

const router = express.Router()

router.use("/podcasts", podcastRouter)

router.get("/token", (req, res)=>{
    if(!req.user){
        res.json({msg:"Token not autheticated"})
        return
    }

    res.json({id: req.user.id, email: req.user.email, token: req.body.token})
})


router.post("/signUp", async (req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password, firstName, lastName} = req.body
    console.log(password)
    console.log(hashPassword(password))
    const newPodcaster = await Podcaster.create({email, firstName, lastName, hashedPassword: hashPassword(password)});
    const token = await generateNewToken(newPodcaster.id, "Podcaster")
    res.json({id: newPodcaster.id, email: newPodcaster.email, token})
    return
})

router.post("/login", async(req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password} = req.body;
    console.log(email, password, req.body)
    const user = await Podcaster.findOne({where: {email}})
    if(!user || !checkHashedPassword(password, user.hashedPassword)){
        res.json({msg: "Username or Password is incorrect"})
        return
    }
    const token = await generateNewToken(user.id, "Podcaster")
    // res.cookie("loginToken", token, {sameSite: "None", secure: true})
    res.append("Set-Cookie", `loginToken=${token}; SameSite=None; Secure`)
    console.log("Token being sent", token)
    res.json({email: user.email, id: user.id, token})
})

router.post("/approveReject/:transcriptId", async (req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please Log In"})
        return
    }
    const transcript = await Transcript.findOne({where: {id: req.params.transcriptId}, include: {model: Podcast, include: {model: Podcaster}}})
    if(!transcript || transcript.Podcast.Podcaster.id !== req.user.id){
        res.json({msg: "An error occured"})
        return
    }
    const {msg} = req.body
    if(msg === "Approve"){
        transcript.status = 4
    } else if(msg === "Reject"){
        transcript.status = 2
    }
    await transcript.save()
    res.json({msg: "Success"})
    return
})




module.exports = router