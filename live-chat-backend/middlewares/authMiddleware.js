const expressAsyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const authMiddleware = expressAsyncHandler(async (req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            const token =req.headers.authorization.split(" ")[1];
            const Secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token,Secret);
            req.user = await userModel.findById(decoded.id).select("-password");
            next();
        }catch(error){
            res.status(401);
            throw new Error("Not Authorize , Token Invalid");
        }
    }else{
        res.status(401);
        throw new Error("Not Authorize , Token is <missing></missing>");
    }
})
module.exports = authMiddleware;