const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();

const router = express.Router()

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