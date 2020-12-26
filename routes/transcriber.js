const express = require("express")
const {hashPassword, createCookie, generateNewToken} = require("../identifyUser")
const {checkHashedPassword} = require("../identifyUser")

const {Transcriber, Transcript, Podcast, Speaker} = require("../db/models")
const transcriptRouter = require("./transcription")
const asyncHandler = require("../asyncHandler")

const router = express.Router()

router.use("/transcription", transcriptRouter)

router.get("/token", (req, res)=>{
    console.log(req.user)
    if(!req.user){
        res.json({msg:"Token not autheticated"})
        return
    }

    res.json({id: req.user.id, email: req.user.email, token: req.body.token})
})


router.post("/signUp", asyncHandler( async (req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password, firstName, lastName} = req.body
    console.log(password)
    console.log(hashPassword(password))
    const newPodcaster = await Transcriber.create({email, firstName, lastName, hashedPassword: hashPassword(password)});
    const token = await generateNewToken(newPodcaster.id, "Transcriber")
    res.json({id: newPodcaster.id, email: newPodcaster.email, token})
    return
}))

router.post("/login", asyncHandler(async(req, res, next) =>{
    if(req.user){
        res.json(req.user)
        return
    }
    const {email, password} = req.body;
    const user = await Transcriber.findOne({where: {email}})
    if(!user || !checkHashedPassword(password, user.hashedPassword)){
        res.json({msg: "Username or Password is incorrect"})
        return
    }
    const token = await generateNewToken(user.id, "Transcriber")
    res.json({email: user.email, id: user.id, token})
}))


router.get("/openprojects", asyncHandler(async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const openProjects = await Transcript.findAll({where:{status: 2}, include: [{model:Podcast}, {model:Speaker}] })
    const data = []
    for(let i = 0; i < openProjects.length; i++){
        const result = {
            title: openProjects[i].title,
            image: openProjects[i].Podcast.photoUrl,
            podcastTitle: openProjects[i].Podcast.name,
            Speakers: openProjects[i].Speakers,
            id: openProjects[i].id,
            podcastName: openProjects[i].Podcast.name
        }
        data.push(result)
    }
    res.json(data)
}))




module.exports = router