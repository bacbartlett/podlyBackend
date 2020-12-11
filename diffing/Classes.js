const test = require("./testingJson/wotd")
const fs = require("fs")

class Word{
    constructor(start_time, end_time, formatted, speaker, suggestions){
        this.startTime = start_time
        this.endTime = end_time
        this.formatted = formatted
        this.suggestions = suggestions
        this.speaker = speaker

        this.plain = this.makePlain(this.formatted)
    }

    makePlain(word){
        const grammar = `~!@#$%^&*()_-+='";:/?.,`.split("")
        const wordArr = word.toLowerCase().split("")
        const result = []
        for(let i = 0; i < wordArr.length; i++){
            if(!grammar.includes(wordArr[i])){
                result.push(wordArr[i])
            }
        }
        return result.join("")
    }
}

const w = new Word(1,2,"Hell!!!oWorlds!!!!???//////Andtheotherstuffs...,asdf")
console.log(w.plain)

class Transcript{
    constructor(formattedJson){
        this.json = formattedJson

        if(this.json){
            this.info = JSON.parse(this.json)
        }
    }

    constructFromAWSJson(json){
        const obj = json
        const result = []
        for(let i = 0; i < obj.results.speaker_labels.segments.length; i++){
            const speakerName = obj.results.speaker_labels.segments[i].speaker_label
            for(let j = 0; j < obj.results.segments[i].alternatives[0].items.length; j++){
                if(obj.results.segments[i].alternatives[0].items[j].type === "punctuation"){
                    const last = result[result.length - 1]
                    result[result.length - 1] = new Word(last.startTime, last.endTime, last.formatted + obj.results.segments[i].alternatives[0].items[j].content, last.speaker)
                    continue
                }
                const w = new Word(obj.results.segments[i].alternatives[0].items[j].start_time, obj.results.segments[i].alternatives[0].items[j].end_time,
                    obj.results.segments[i].alternatives[0].items[j].content, speakerName)
                result.push(w)
            }
        }
        this.info = result
    }

    getJson(){
        return JSON.stringify(this.info)
    }
}

module.exports = {Word, Transcript}
