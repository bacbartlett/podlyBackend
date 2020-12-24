const express = require("express")
const { result } = require("lodash")

const {Transcript, Podcast, Researcher, Note, Speaker, Podcaster} = require("../db/models")

const router = express.Router()

const resultsPerPage = 20


router.get("/allTranscripts/:pageNumber", async(req,res, next)=>{
    const transcripts = await Transcript.findAll({where: {status: 3}, include: {model: Speaker, Podcast}})
    const results = []
    for(let i = 0; i < resultsPerPage; i++){
        if(transcripts[i + (req.params.pageNumber * resultsPerPage)]){
            results.push(transcripts[i + (req.params.pageNumber * resultsPerPage)])
        }
    }
    res.json({results, totalPages: Math.ceil(transcripts.length / resultsPerPage)})
})

router.get("/allPodcasts/:pageNumber", async(req,res, next)=>{
    const podcasts = await Podcast.findAll()
    const results = []
    for(let i = 0; i < resultsPerPage; i++){
        if(podcasts[i + (req.params.pageNumber * resultsPerPage)]){
            podcasts[i + (req.params.pageNumber * resultsPerPage)].podcasterId = null;
            results.push(podcasts[i + (req.params.pageNumber * resultsPerPage)])
        }
    }
    res.json({results, totalPages: Math.ceil(podcasts.length / resultsPerPage)})
})

router.get("/allEpisodes/:podcastId", async (req, res, next) =>{
    const transcripts = await Transcript.findAll({where: {podcastId: req.params.podcastId, status: 4}, include: [{model: Podcast, include:{model:Podcaster}}, {model: Speaker}]})
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
})

router.get("/allNotes", async(req,res,next)=>{
    if(!req.user){
        res.json({msg: "Please Log in"})
        return
    }
    const notes = await Note.findAll({where: {researchId: req.user.id}, include:{model: Transcript}});
    req.json({data: notes})
})


module.exports = router