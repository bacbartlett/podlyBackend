const test = require("./testingJson/wotd")
const fs = require("fs")
const Differ = require("./index")
const {Transcript, Word} = require("./Classes")
const testInput = require("./testingJson/inputTest")

const oldT = new Transcript()
oldT.constructFromAWSJson(test)
const newT = new Transcript(testInput)

const d = new Differ(oldT.info, newT.info)


fs.writeFile("testOut", JSON.stringify(d.result), ()=>console.log("saved"))