const {Word, Transcript} = require("./Classes")

class Differ{
    constructor(oldArr, newArr){
        this.searchBuffer = 100
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
        while(this.currentNew < this.newArr.length){
            //if it is the case that they are the same
            if(this.currentNew === 13){
                //console.log(this.oldArr[this.currentOld].plain, this.newArr[this.currentNew].plain)
            }
            if(this.oldArr[this.currentOld].plain === this.newArr[this.currentNew].plain){
                const w = new Word(this.oldArr[this.currentOld].startTime, this.oldArr[this.currentOld].endTime, this.newArr[this.currentNew].formatted, this.newArr[this.currentOld].speaker)
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
        this.addBackTimeStamps()
    }

    findTheNextSame(){
        let searchIndex = this.currentOld + 1
        let matched = 0
        while(searchIndex < this.currentOld + this.searchBuffer && searchIndex < this.oldArr.length){
            if(this.newArr[this.currentNew + matched].plain === this.oldArr[searchIndex].plain){
                matched++
                if(matched >= this.simMarker){
                    const w = new Word(this.oldArr[searchIndex].startTime, this.oldArr[searchIndex].endTime, this.newArr[this.currentNew].formatted, this.newArr[this.currentNew].speaker)
                    this.completedOld++
                    this.currentOld++
                    this.completedNew = this.currentNew
                    return
                }  
            }else{
                //console.log(this.newArr[this.currentNew + matched].plain, this.oldArr[searchIndex].plain)
                // //console.log("resetting")
                matched = 0
            }
            searchIndex++
        }
        //this new word does not appear in old
        this.result.push(new Word(undefined, undefined, this.newArr[this.currentNew].formatted, this.newArr[this.currentNew].speaker))
        this.completedNew = this.currentNew
        this.currentNew++
    }

    addBackTimeStamps(){
        //console.log("rinning add back time stamps")
        for(let i = 0; i < this.result.length; i++){
            const currentWord = this.result[i]
            if(currentWord.startTime){
                continue
            }
            ////console.log("Found one:", this.result[i])
            let counter = 1
            let j = i + 1;
            while(j < this.result.length && !this.result[j].startTime  ){
                counter++
                j++
            }
            let dividedTime;
            if(j === this.result.length){
                dividedTime = .3
            } else{
                //console.log(this.result[j].startTime, this.result[i - 1].endTime, counter, (this.result[j].startTime - this.result[i - 1].endTime) / (counter) )
                dividedTime = (this.result[j].startTime - this.result[i - 1].endTime) / (counter)
            }
            for(let k = 0; k < counter; k++){
                this.result[i + k - 1].startTime = this.result[i - 1].endTime + (k * counter)
                this.result[i + k - 1].endTime = this.result[i - 1].endTime + ((k + 1) * counter)
                //console.log(this.result[i + k - 1])
            }
            ////console.log("done for this one:", this.result[i])
        }
    }
}

module.exports = {Differ}