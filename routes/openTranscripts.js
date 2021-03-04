const express = require("express")
const AWS = require("aws-sdk")
const config = require("../config")
const {Differ} = require("../diffing")
const {Word} = require("../diffing/Classes")
const asyncHandler = require("../asyncHandler")

AWS.config.update({
    secretAccessKey: config.awsConfig.secretKey,
    accessKeyId: config.awsConfig.accessKey,
    region: config.awsConfig.region
})

const s3 = new AWS.S3()


const {Transcript, Transcriber, Podcast, Speaker, Podcaster} = require("../db/models")

const openTranscripts = express.Router()

openTranscripts.get("/:transcriptId", asyncHandler(async(req, res, next) =>{
    //console.log("I am looking for:", req.params.transcriptId)
    const transcript = await Transcript.findOne({where: {id: req.params.transcriptId}, include: [{model: Speaker}, {model: Podcast, include: {model: Podcaster}}, {model: Transcriber}]})
    let validated = false;
    if(transcript.status === 4){
        validated = true
    }
    if(!validated){
        res.json({msg: "This transcipt is still being processed"})
        return
    }
    const mediaUrl = transcript.dynamoUrl
    const Key = mediaUrl.split("/").pop()
    //console.log("I AM FIRST KEY!!!!!!!!!!!!!!!", Key)
    const json = await s3.getObject({
        Bucket: "wisjson",
        Key
    }).promise()
    const data = JSON.parse(json.Body)

    //console.log(JSON.parse(json.Body).length)

    res.json({data, transcript})
}))

module.exports = openTranscripts