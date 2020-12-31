const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bearerToken = require("express-bearer-token");
const secret = require("./config").jwtConfig.secret;
const {Researcher, Transcriber, Podcaster} = require("./db/models")
const identifyUser = async(req, res, next)=>{
    if(!req.cookie){
        req.user = null;
        next()
        return
    }
    const token = req.cookie;
    jwt.verify(token, secret, null, async (err, payload) =>{
        if(err || !payload){
            req.user = null
            next()
            return
        }
        //console.log(err, payload)
        const {userId, userType} = payload
        let user;

        try{
            if(userType === "Researcher"){
                user = await Researcher.findByPk(userId)
            }
            else if(userType === "Transcriber"){
                user = await Transcriber.findByPk(userId)
            }
            else if(userType === "Podcaster"){
                user = await Podcaster.findByPk(userId)
            }
        } catch(e){
            //console.log(e)
        }
        req.user = {id: user.id, email: user.email, type: userType}
        next()
        return
    })
}

const generateNewToken = async(userId, userType)=>{
    return await jwt.sign({userId, userType}, secret)
}

const createCookie = async(userId, userType, res)=>{
    const token = await generateNewToken(userId, userType);
    res.cookie("loginToken", token, {httpOnly: false})
}

const deleteCookie = (res) =>{
    res.cookie("loginToken", null, {httpOnly: false})
}

const hashPassword = (password) =>{
    return bcrypt.hashSync(password, 10)
}

const checkHashedPassword = (password, hash) =>{
    //console.log(password, hash.toString())
    return bcrypt.compareSync(password, hash.toString())
}


module.exports = {
    checkHashedPassword,
    hashPassword,
    deleteCookie,
    createCookie,
    generateNewToken,
    identifyUser
}