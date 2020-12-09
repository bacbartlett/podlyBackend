const express = require("express");
const podcasterRouter = require("./podcaster")

const {Researcher, Note, Transcript, Transcriber, Podcast, Podcaster} = require("../db/models")

const router = express.Router();

router.use("/podcaster", podcasterRouter)

module.exports = router