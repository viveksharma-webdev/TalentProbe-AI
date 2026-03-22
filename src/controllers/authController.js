const userModel = require("../models/userModel.js");
const blacklistModel = require("../models/blacklistModel.js");
const bcrypt= require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUserController(req,res){

    try{
        const{email, username, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        };

        const ExistedUser = await userModel.findOne({ $or:[{username}, {email}]});

        if(ExistedUser){
            return res.status(400).json({ message: "User Already exist, please provide different username or email"})
        };

        const hash = await bcrypt.hash(password,10);

        const user = await userModel.create({ username, email, password: hash});

        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.cookie("token", token);

        res.status(201).json({
            message: "User registered Successfully",
            user: { id: user._id, username: user.username, email: user.email}
        })

    } catch(error){
        console.log("Error in registering user")
    };
};

async function loginUserController(req,res){
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email:email});
        if(!user) return res.status(400).json({message:"invalid email or password"});

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) return res.status(400).json({ message: "Invalid email or password"});

        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.cookie("token", token);

        res.status(200).json({ 
            message:" user logged in successfully",
            user: { id: user._id, username: user.username, email: user.email}
        })

    } catch(error){
        console.log("Error in Loggin user", error)
    }
};

async function logoutUserController(req,res){
    try{
        const token = req.cookies.token;
        if(token) {
            await blacklistModel.create({token})
        }
        
        res.clearCookie("token");

        res.status(200).json({message:" user logout successfully"})

    }catch(error){
        console.log("Error in Logging out");
    }
}

async function getMeController(req,res){
    try{

        const user = await userModel.findById(req.user.id)

        res.status(200).json({
            message: "User details fetched Successfully",
            user:{
                username: user.username,
                id: user._id,
                email: user.email
            }
        })

    }catch(error){

    }
}

module.exports  = {registerUserController, loginUserController, logoutUserController, getMeController};