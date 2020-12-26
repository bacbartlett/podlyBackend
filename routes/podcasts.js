const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();
const AWS = require("aws-sdk")
const config = require("../config")
const fetch = require("node-fetch")
const fs = require("fs")
const timers = require("timers")
const {Podcast, Transcript, Speaker, Podcaster} = require("../db/models")
const {Transcript: TranscriptClass} = require("../diffing/Classes")
const asyncHandler = require("../asyncHandler")
//const multer = require("multer")

AWS.config.update({
    secretAccessKey: config.awsConfig.secretKey,
    accessKeyId: config.awsConfig.accessKey,
    region: config.awsConfig.region
})

const s3 = new AWS.S3()
const Transcribe = new AWS.TranscribeService()

const router = express.Router()


const readyForEditor = async (id) =>{
    const transcript = await Transcript.findByPk(id)
    if(!transcript.dynamoUrl){
        console.log("No url")
    }
    const dynamoUrl = transcript.dynamoUrl 
    const Key = dynamoUrl.split("/").pop()
    console.log(Key)
    const json = await s3.getObject({
        Bucket: "wisjson",
        Key
    }).promise()
    console.log("First download completed")
    const data = JSON.parse(json.Body)
    const t = new TranscriptClass()
    t.constructFromAWSJson(data)
    const buff = Buffer.from(t.getJson())
    const uploadKey = "custom" + Date.now().toString() + ".json"
    const params = {
        Body: buff,
        Bucket: "wisjson",
        Key: uploadKey
    }
    const res = await s3.putObject(params).promise()
    console.log(res)
    const temp = transcript.dynamoUrl.split("/")
    temp.pop()
    temp.push(uploadKey)
    transcript.dynamoUrl = temp.join("/")
    transcript.status = 2;
    transcript.save()
}

const checkIfDone = async (t, podcastInfo) => {
    console.log("here is my arg: ", t)
    console.log("Checking status")
    const status = await Transcribe.getTranscriptionJob({TranscriptionJobName: t.t.TranscriptionJob.TranscriptionJobName}).promise()
    console.log(status)
    if(status.TranscriptionJob.TranscriptionJobStatus === "COMPLETED"){
        console.log("Done! Do next thing")
        const transcript = await Transcript.findByPk(t.podcastInfo.transcriptId)
        transcript.status = 2
        transcript.dynamoUrl = status.TranscriptionJob.Transcript.TranscriptFileUri
        await transcript.save()
        readyForEditor(transcript.id)
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

router.post("/:podcastId/newjob", asyncHanlder(async (req, res, next) =>{
    if(!req.user){
        res.json({msg:"Please Login"})
        return
    }
    const {mediaUrl, speakerNames, title} = req.body
    const podcastInfo = {mediaUrl, podcastId: req.params.podcastId, speakerNames}
    
    const transcript = await Transcript.create({status: 1, link: mediaUrl, podcastId: req.params.podcastId, title: title})
    console.log(transcript)
    for(let i = 0; i < speakerNames.length; i++){
        const speaker = await Speaker.create({transcriptId: transcript.id, name: speakerNames[i]})
    }
    console.log("This is the mediaurl:", mediaUrl, "and this is the body:", req.body)
    podcastInfo.transcriptId = transcript.id
    res.json({msg: "starting"})
    
    console.log("Starting")
    const resp = await fetch(mediaUrl)
    console.log("Finished first fetch")
    const buff = await resp.buffer()
    console.log("Got the buffer")
    
    const uploadOptions = {
        Bucket: "wisproject",
        ACL: "public-read",
        Key: Date.now().toString(),
        Body: buff,
        ContentType: "mp3"
    }
    console.log("beginning upload")
    const upload = await s3.upload(uploadOptions).promise()
    console.log(upload.Location)
    transcript.link = upload.Location
    await transcript.save()
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
            MaxSpeakerLabels: podcastInfo.speakerNames.length + 1
        }
    }
    console.log("About to start")
    const t = await Transcribe.startTranscriptionJob(transcriptionOptions).promise()
    console.log("started")
    console.log(t)
    checkIfDone({t, podcastInfo})
}))

router.post("/new",  asyncHandler(async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const {rssFeedUrl} = req.body
    const feed = await parser.parseURL(rssFeedUrl)
    const title = feed.title
    const photoUrl = feed.image.url
    console.log(photoUrl)
    const nPodcast = await Podcast.create({podcasterId: req.user.id, name: title, rssFeedUrl, photoUrl: photoUrl})
    const podcasts = await Podcast.findAll({where:{podcasterId: req.user.id}})
    res.json(podcasts)
}))

router.get("/myPodcasts", asyncHanlder(async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please Log In"})
        return
    }
    const podcasts = await Podcast.findAll({where:{podcasterId:req.user.id}})
    res.json({results: podcasts})
    return
}))

router.get("/pendingJobs", asyncHandler(async(req,res,next)=>{
    if(!req.user){
        res.json({msg: "Please Log In"})
        return
    }
    const transcripts = await Transcript.findAll({where: {status: 3}, include: [{model: Podcast, include:{model:Podcaster}}, {model: Speaker}]})
    const results = []
    for(let i = 0; i < transcripts.length; i++){
        console.log("FOUND ONE")
        if(transcripts[i].Podcast.Podcaster.id === req.user.id){
            const result = {
                title: transcripts[i].title,
                image: transcripts[i].Podcast.photoUrl,
                podcastTitle: transcripts[i].Podcast.name,
                Speakers: transcripts[i].Speakers,
                id: transcripts[i].id,
                podcastName: transcripts[i].Podcast.name
            }
            results.push(result)
            console.log("PUSHED IT")
        }
    }
    res.json(results)
}))


//check that it is their podcast
router.get("/:podcastId", asyncHandler(async (req, res) =>{
    if(!req.user){
        res.json({msg: "Please Log In"})
        return
    }
    const podcast = await Podcast.findByPk(req.params.podcastId)
    const feed = await parser.parseURL(podcast.rssFeedUrl)
    const data = {}
    data.image = feed.image.url
    data.title = feed.title
    data.description = feed.description
    const items = []
    for(let i = 0; i < 20; i++){
        const item = feed.items[i]
        const transcript = await Transcript.findOne({where:{podcastId: req.params.podcastId, title: item.title}, include:{model: Speaker}})
        console.log(transcript)
        const episode = {
            title: item.title,
            image: feed.image.url,
            podcastTitle: data.title,
            duration: item.itunes.duration,
            mediaUrl: item.enclosure.url
        }
        if(!transcript){
            episode.status = 0
            episode.Speakers = []
        }
        if(transcript){
            episode.id = transcript.id
            episode.status = transcript.status,
            episode.Speakers = transcript.Speakers
        }
        

        items.push(episode)
    }
    res.json(items)
}))





module.exports = router