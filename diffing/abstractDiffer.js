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

// const composeOldString = (str) =>{
//     result = []
//     words = str.split(" ")
//     for(let i = 0; i < words.length; i++){
//         result.push(new Word(words[i], i))
//     }
//     return result
// }

// const oldArr = composeOldString("this is the first sentence i am writing and i think it is rather fine dont you")

// const newArr = "this is the second sentence i am writing and i think it is rather rough".split(" ")





// const diffing = (oldArr, newArr) =>{
//     const searchLength = 7
//     const minSimilarityLength = 4
    
//     let completedOldIndex = 0
//     let completedNewIndex = 0
//     let currentNewIndex = 0
//     let currentNewIndex = 0
    
//     const result = []
//     while(completedNewIndex < newArr.length){
//         //if they are the same. Simple case
//         if(newArr[currentNewIndex] === oldArr[currentOldIndex].word){
//             result.push(new Word(newArr[currentNewIndex], oldArr[currentOldIndex].time))
//             completedOldIndex = currentOldIndex;
//             completedNewIndex = currentNewIndex;
//             currentNewIndex++
//             currentNewIndex++
//             continue
//         }

//         //if they are not the same
//         found = false
//         let searchOldIndex = currentOldIndex + 1
//         while(!found && searchOldIndex < currentOldIndex + searchLength){
//             if(newArr[currentNewIndex] !== oldArr[searchOldIndex]){
//                 searchOldIndex++;
//                 continue;
//             }
//             //seeing if this is a new waypoint
//             let matching = true;
//             let matchOldIndex = searchOldIndex + 1;
//             while(matching && matchOldIndex < oldSearchingIndex + minSimilarityLength){
//                 let matchedNumber = matchOldIndex - oldSearchingIndex;
//                 if(oldArr[matchOldIndex] === newArr[currentNewIndex + matchedNumber]){
//                     continue
//                 }
//                 found = false
//             }

//             //this was not a waypoint
//             if(!found){
//                 continue
//             }
//             //this was a waypoint!

//         }

//     }
// }


class Differ{
    constructor(oldArr, newArr){
        this.searchBuffer = 11
        this.simMarker = 4

        this.oldArr = oldArr;
        this.newArr = newArr;

        this.completedOld = 0
        this.completedNew = 0
        this.currentOld = 0
        this.currentNew = 0

        this.result = []
        
        this.findDiff()
    }

    findDiff(){
        while(this.currentNew < newArr.length){
            //if it is the case that they are the same
            //console.log(this.currentOld)
            //console.log(this.oldArr[this.currentOld].word, this.newArr[this.currentNew])
            if(this.oldArr[this.currentOld].plain === this.newArr[this.currentNew].plain){
                //console.log("ture")
                const w = new Word(this.oldArr[this.currentOld].startTime, this.oldArr[this.currentOld].endTime, this.newArr[this.currentNew].formatted, this.oldArr[this.currentOld].speaker)
                this.result.push(w)
                this.completedNew = this.currentNew;
                this.completedOld = this.currentOld;
                this.currentNew++
                this.currentOld++
                continue
            }

            //if not the same
            this.findTheNextSame()
        }
    }

    findTheNextSame(){
        let searchIndex = this.currentOld + 1
        let matched = 0
        while(searchIndex < this.currentOld + this.searchBuffer && searchIndex < this.oldArr.length){
            //console.log("Comparing:", this.newArr[this.currentNew],this.oldArr[searchIndex].word)
            if(this.newArr[this.currentNew + matched].plain === this.oldArr[searchIndex].plain){
                matched++
                //console.log(matched)
                if(matched >= this.simMarker){
                    const w = new Word(this.oldArr[this.currentOld].startTime, this.oldArr[this.currentOld].endTime, this.newArr[this.currentNew].formatted, this.oldArr[this.currentOld].speaker)
                    this.completedOld++
                    this.currentOld++
                    this.completedNew = this.currentNew
                    return
                }  
            }else{
                //console.log("resetting")
                matched = 0
            }
            searchIndex++
        }
        //this new word does not appear in old
        this.result.push(new Word(null, null, this.newArr[this.currentNew].formatted, this.oldArr[this.currentOld].speaker)))
        this.completedNew = this.currentNew
        this.currentNew++
    }
}

module.exports = {Differ}
