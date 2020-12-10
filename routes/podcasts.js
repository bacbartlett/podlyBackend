const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();
const AWS = require("aws-sdk")
const config = require("../config")
const fetch = require("node-fetch")
const fs = require("fs")
const timers = require("timers")
//const multer = require("multer")

AWS.config.update({
    secretAccessKey: config.awsConfig.secretKey,
    accessKeyId: config.awsConfig.accessKey,
    region: config.awsConfig.region
})

const s3 = new AWS.S3()
const Transcribe = new AWS.TranscribeService()

const router = express.Router()

const checkIfDone = async (t) => {
    console.log("here is my arg: ", t)
    console.log("Checking status")
    const status = await Transcribe.getTranscriptionJob({TranscriptionJobName: t.t.TranscriptionJob.TranscriptionJobName}).promise()
    console.log(status)
    if(status.TranscriptionJob.TranscriptionJobStatus === "COMPLETED"){
        console.log("Done! Do next thing")
    } else{
        console.log("not done yet")
        timers.setTimeout(checkIfDone, 60000, t)
    }
}

//need to add check that the user is the owner of this podcast
// router.get("/test", async (req, res) =>{
//     res.json({msg: "starting"})
//     console.log("Starting")
//     const resp = await fetch("https://rss.art19.com/episodes/6df096a5-2988-4d52-87da-d5357b27a07d.mp3")
//     console.log("Finished first fetch")
//     const buff = await resp.buffer()
//     console.log("Got the buffer")
//     const uploadOptions = {
//         Bucket: "wisproject",
//         ACL: "bucket-owner-full-control",
//         Key: Date.now().toString(),
//         Body: buff,
//         ContentType: "mp3"
//     }
//     console.log("beginning upload")
//     const upload = await s3.upload(uploadOptions).promise()
//     console.log(upload.Location)
//     console.log(upload)
//     const transcriptionOptions ={
//         Media:{
//             MediaFileUri: upload.Location
//         },
//         LanguageCode: "en-US",
//         TranscriptionJobName: Date.now().toString(),
//         MediaFormat: 'mp3',
//         OutputBucketName: "wisjson",
//         Settings:{
//             ShowSpeakerLabels: true,
//             ShowAlternatives: true,
//             MaxAlternatives: 4,
//             MaxSpeakerLabels: 5,
//         }
//     }
//     console.log("About to start")
//     const t = await Transcribe.startTranscriptionJob(transcriptionOptions).promise()
//     console.log("started")
//     console.log(t)
//     checkIfDone(t)

// })

router.post("/:podcastId/newjob", async (req, res) =>{
    if(!req.user){
        res.json({msg:"Please Login"})
        return
    }
    const mediaUrl = req.body.mediaUrl
    res.json({msg: "starting"})
    console.log("Starting")
    const resp = await fetch(mediaUrl)
    console.log("Finished first fetch")
    const buff = await resp.buffer()
    console.log("Got the buffer")
    const uploadOptions = {
        Bucket: "wisproject",
        ACL: "bucket-owner-full-control",
        Key: Date.now().toString(),
        Body: buff,
        ContentType: "mp3"
    }
    console.log("beginning upload")
    const upload = await s3.upload(uploadOptions).promise()
    console.log(upload.Location)
    console.log(upload)
    const transcriptionOptions ={
        Media:{
            MediaFileUri: upload.Location
        },
        LanguageCode: "en-US",
        TranscriptionJobName: Date.now().toString(),
        MediaFormat: 'mp3',
        OutputBucketName: "wisjson",
        Settings:{
            ShowSpeakerLabels: true,
            ShowAlternatives: true,
            MaxAlternatives: 4,
            MaxSpeakerLabels: 5,
        }
    }
    console.log("About to start")
    const t = await Transcribe.startTranscriptionJob(transcriptionOptions).promise()
    console.log("started")
    console.log(t)
    const podcastInfo = req.body.pdocastInfo
    checkIfDone({t, podcastInfo})
})

router.post("/new", async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const {rssFeedUrl} = req.body
    const feed = await parser.parseURL(rssFeedUrl)
    const title = feed.title
    const nPodcast = await Podcast.create({podcasterId: req.user.id, name: title, rssFeedUrl})
    const podcasts = await Podcast.findAll({where:{userId: req.user.id}})
    res.json(podcasts)
})

router.get("/myPodcasts", async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const podcasts = await Podcast.findAll({where:{userId: req.user.id}})
    res.json(podcasts)
    return
})

router.get("/:podcastId", async (req, res) =>{
    const feed = await parser.parseURL("https://rss.art19.com/merriam-websters-word-of-the-day")
    const data = {}
    data.image = feed.image.url
    data.title = feed.title
    data.description = feed.description
    data.items = []
    for(let i = 0; i < 20; i++){
        data.items.push(feed.items[i])
    }
    res.json(data)
})



module.exports = router