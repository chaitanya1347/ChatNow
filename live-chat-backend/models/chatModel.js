
const mongoose = require("mongoose")

const chatModel = mongoose.Schema({
    chatName :{
        type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
    }],

    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Message"
    } ,
    groupAdmin:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

},
{timestamps:true}
);

// Define pre middleware to update updatedAt on access
chatModel.pre(/^find/, function(next) {
    // Update updatedAt field whenever find operation is executed
    this.updateOne({}, { $set: { updatedAt: new Date() } });
    next();
});

const chat = mongoose.model("Chat",chatModel);
module.exports = chat;