const express = require("express");
const podcasterRouter = require("./podcaster")
const transcriberRouter = require("./transcriber")
const researcherRouter = require("./researcher")

const {Researcher, Note, Transcript, Transcriber, Podcast, Podcaster} = require("../db/models")

const router = express.Router();

router.use("/podcaster", podcasterRouter)
router.use("/transcriber", transcriberRouter)
router.use("/researcher", researcherRouter)

module.exports = router