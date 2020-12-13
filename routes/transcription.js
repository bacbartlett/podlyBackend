const express = require("express")
const AWS = require("aws-sdk")
const config = require("../config")

AWS.config.update({
    secretAccessKey: config.awsConfig.secretKey,
    accessKeyId: config.awsConfig.accessKey,
    region: config.awsConfig.region
})

const s3 = new AWS.S3()


const {Transcript, Transcriber, Podcast, Speaker} = require("../db/models")



const router = express.Router()

router.get("/:transcriptId", async(req, res, next) =>{
    if(!req.user){
        res.json({msg: "Please log in"})
        return
    }
    const transcript = await Transcript.findOne({where: {id: req.params.transcriptId}, include: Speaker})
    const mediaUrl = transcript.dynamoUrl
    const Key = mediaUrl.split("/").pop()
    const json = await s3.getObject({
        Bucket: "wisjson",
        Key
    }).promise()
    const data = JSON.parse(json.Body)

    res.json({data, transcript})
})



module.exports = router