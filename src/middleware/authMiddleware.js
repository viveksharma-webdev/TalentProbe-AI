const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistModel.js")

async function authUser(req,res,next){

    const token = req.cookies.token
    if(!token) return res.status(401).json({message: "Token Not Found"});

    const isTokenBlacklisted = await blacklistTokenModel.findOne({token});

    if(isTokenBlacklisted) return res.status(401).json({message:"Token is invalid"})
    
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();

    }catch(error){

        return res.status(401).json({message: "Invalid Token"});

    }
}

module.exports = {authUser};