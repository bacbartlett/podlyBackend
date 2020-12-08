const express = require("express");
const podcastRouter = require("./podcasts")

const router = express.Router();

router.use("/podcasts", podcastRouter)

module.exports = router