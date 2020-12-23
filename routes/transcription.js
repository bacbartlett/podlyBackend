const express = require("express")
const AWS = require("aws-sdk")
const config = require("../config")
const {Differ} = require("../diffing")
const {Word} = require("../diffing/Classes")

AWS.config.update({
    secretAccessKey: config.awsConfig.secretKey,
    accessKeyId: config.awsConfig.accessKey,
    region: config.awsConfig.region
})

const s3 = new AWS.S3()


const {Transcript, Transcriber, Podcast, Speaker, Podcaster} = require("../db/models")



const router = express.Router()

router.get("/:transcriptId", async(req, res, next) =>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    console.log("I am looking for:", req.params.transcriptId)
    const transcript = await Transcript.findOne({where: {id: req.params.transcriptId}, include: [{model: Speaker}, {model: Podcast, include: {model: Podcaster}}, {model: Transcriber}]})
    let validated = false;
    if(transcript.status === 2 && req.user.type === "Transcriber"){
        validated = true;
    } else if(transcript.status === 3){
        if(user.type === "Podcaster"){
            if(transcript.Podcast.Podcaster.id === req.user.id){
                validated = true
            }
        } else if(user.type === "Transcriber"){
            if(transcript.Transcriber === req.user.id){
                validated = true
            }
        }
    } else if(transcript.status === 4){
        validated = true
    }
    if(!validated){
        res.json({msg: "This transcipt is still being processed"})
        return
    }
    const mediaUrl = transcript.dynamoUrl
    const Key = mediaUrl.split("/").pop()
    console.log("I AM FIRST KEY!!!!!!!!!!!!!!!", Key)
    const json = await s3.getObject({
        Bucket: "wisjson",
        Key
    }).promise()
    const data = JSON.parse(json.Body)

    console.log(JSON.parse(json.Body).length)

    res.json({data, transcript})
})

router.post("/:transcriptionId", async(req, res, next)=>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const {data} = req.body
    console.log(data.length)
    const transcript = await Transcript.findOne({where: {id: req.params.transcriptionId}, include: Speaker})
    const Key = transcript.dynamoUrl.split("/").pop()
    const Bucket = "wisjson"
    const prom = await s3.getObject({
        Bucket,
        Key
    }).promise()

    const properData = []
    for(let i = 0; i < data.length; i++){
        const currentWord = data[i]
        properData.push(new Word(currentWord.startTime, currentWord.endTime, currentWord.formatted, currentWord.speaker))
    }
    console.log(JSON.parse(prom.Body).length, properData.length)
    const d = new Differ(JSON.parse(prom.Body), properData)

    const buff = Buffer.from(JSON.stringify(d.result))
    const uploadKey = "transcribed" + Date.now().toString() + ".json"
    const params = {
        Body: buff,
        Bucket: "wisjson",
        Key: uploadKey
    }
    const res1 = await s3.putObject(params).promise()
    console.log(res1)
    const temp = transcript.dynamoUrl.split("/")
    temp.pop()
    temp.push(uploadKey)
    transcript.dynamoUrl = temp.join("/")
    transcript.status = 3;
    transcript.transcriberId = req.user.id
    transcript.save()

    res.json({msg: "Success"})

    // console.log(d.result)

})



module.exports = router