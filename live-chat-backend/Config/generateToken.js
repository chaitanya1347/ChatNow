const jwt = require("jsonwebtoken");

const generateToken = (id)=>{
    let Secret = process.env.JWT_SECRET;
    
    return jwt.sign({id},Secret,{
        expiresIn: "30d",
    });
}

module.exports  = generateToken;
