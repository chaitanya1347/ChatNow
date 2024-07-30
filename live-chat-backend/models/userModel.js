const mongoose = require("mongoose")
const bcrpyt = require("bcryptjs");

const userModel = mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true,
    },
    password  :{
        type:String,
        required:true
    },
    pic :{
        type:String,
    }
},{timeStamp : true});


userModel.methods.matchPassword = async function(password){
    
    return await bcrpyt.compare(password,this.password);
}

userModel.pre('save',async function(next){
    if(!this.isModified){
        next();
    }

    const salt  = await bcrpyt.genSalt(10);
    this.password = await bcrpyt.hash(this.password,salt);

})

const user = mongoose.model("User",userModel);
module.exports = user;