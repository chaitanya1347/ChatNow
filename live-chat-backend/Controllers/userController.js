const expres = require("express");
const userModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/generateToken");

loginController = expressAsyncHandler (async(req,res)=>{
    const {name,password} =  req.body;
    const user = await userModel.findOne({name});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id  : user._id,
            name : user.name,
            email:user.email,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        });
    }else{
        res.status(401);
        throw new Error("Invalid Username or Password");
    }

})

registerController = expressAsyncHandler (async (req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!name || !email || !password ){
        throw new Error("All input fields have not been filled");
    }

    const userExist = await userModel.findOne({email});
    if(userExist){  
        throw new Error("User Already Exists");
    }

    const userNameExist = await userModel.findOne({name});
    if(userNameExist){
        throw new Error("Username Already taken");
    }
    const user = await userModel.create({name,email,password,pic});
    if(user){
        res.status(201).json({
            _id  : user._id,
            name : user.name,
            email:user.email,
            pic : user.pic,
            isAdmin : user.isAdmin,
            token : generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error("Registration Error");
    }
});

const findUsers = expressAsyncHandler(async(req,res)=>{
    const keyword = req.query.search ? {
        $or:[{name:{$regex : req.query.search , $options : 'i'}},
             {email:{$regex : req.query.search , $options : 'i'}}]
    } : {}
    
    const users = await userModel.find(keyword);
    res.send(users);
});

const fetchUsers = expressAsyncHandler(async (req, res)=>{
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400);
        throw new error(error.message);
    }
    
})
module.exports = {loginController,registerController,findUsers,fetchUsers};