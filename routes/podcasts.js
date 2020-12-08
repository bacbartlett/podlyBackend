const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();

const router = express.Router()

router.get("/:podcastId", async (req, res) =>{
    const feed = await parser.parseURL("https://rss.art19.com/merriam-websters-word-of-the-day")
    res.json({feed})
})

module.exports = router