const root = document.getElementById("WrittenInSoundEmbeddedPlayer")

const cssStyleSheet = document.createElement("link")
cssStyleSheet.href = "embeddedPlayer.css"
cssStyleSheet.type = "text/css"
cssStyleSheet.rel = " stylesheet"
root.before(cssStyleSheet)

console.log("running")
const code = root.getAttribute("code")
console.log("code:", code)

const masterDiv = document.createElement("div")

const getTextAndInsert = async () => {
    const res = await fetch("https://podlybackend2.herokuapp.com/transcriber/transcription/" + code, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const hold = await res.json()
    const data = hold.data

    console.log(hold)

    const audio = document.createElement("audio")
    audio.setAttribute("id", "audio")
    audio.setAttribute("src", hold.transcript.link)
    audio.setAttribute("controls", true)

    masterDiv.appendChild(audio)

    const result = []
    let current = document.createElement("div")
    let currentSpeaker = data[0]?.speaker

    for(let i = 0; i < data.length; i++){
        if(currentSpeaker !== data[i].speaker && i !== 0){
            result.push(current)
            currentSpeaker = data[i].speaker
            current = document.createElement("div")
        }
        const s = document.createElement("span")
        s.innerHTML = data[i].formatted
        s.setAttribute("startTime", data[i].startTime)
        s.setAttribute("endTime", data[i].endTime)
        s.setAttribute("speaker", data[i].speaker)
        current.appendChild(s)
    }
    result.forEach(el=>{
        const section = document.createElement("div")
        section.classList.add("section")

        const speakerSection = document.createElement("div")
        speakerSection.classList.add("speakerSecontion")
        console.log(el)
        speakerSection.innerHTML = el.childNodes[0]?.getAttribute("speaker") + ":"

        // const textDiv = document.createElement("div")

        

        section.appendChild(speakerSection)
        section.appendChild(el)

        masterDiv.appendChild(section)
    })

    


}


getTextAndInsert()


root.after(masterDiv)
