const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const user = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    var isGroup = await Chat.find({ 
      isGroupChat: true,
      _id : userId
    })

    if(isGroup.length > 0){
      isGroup[0].updatedAt = new Date(); 
      isGroup[0].save();
      res.send(isGroup[0]);
    }else if (isChat.length > 0) {
      isChat[0].updatedAt = new Date(); 
      isChat[0].save();
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await createdChat .populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });

const fetchChat = expressAsyncHandler(async (req,res)=>{
  try {
    var chat  = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate("users","-password").populate("latestMessage").populate("groupAdmin","-password").sort({updatedAt:-1});
 
    chat = await User.populate(chat,{
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(chat)
  } catch (error) {
      res.status(400);
      throw new Error(error.message);
  } 
  });

const createGroupChat = expressAsyncHandler(async (req,res)=>{
  const groupName = req.body.name;
  const users = req.body.users;
  if(!groupName && !users){
    res.status(400).send("Pleas fill in all the fields");
  }

  if(users.length < 2){
    res.status(400).send("The group should contain atleast 2 members");
  }
  users.push(req.user);

  try {
      const groupChat = await Chat.create({
         chatName : groupName,
         users : users,
         isGroupChat : true,
         groupAdmin : req.user
      })

      const fullGroupChat = await Chat.findOne({_id : {$eq : groupChat._id}})
      .populate("latestMessage").populate("groupAdmin","-password");
      res.status(200).send(fullGroupChat);

  } catch (error) {
    res.status(400);
    throw new error(error.message); 
  }
});

const fetchGroupChats = expressAsyncHandler(async (req, res)=>{
  const keyword = req.query.search ? {
    chatName:{$regex : req.query.search , $options : 'i'},
     isGroupChat: true,
     users: { $elemMatch: { $eq: req.query.userId } }
} : {
  isGroupChat: true,
  users: { $elemMatch: { $eq: req.query.userId } }
}
  const groupChat = await Chat.find(keyword);
  res.send(groupChat);
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  
  const { chatId, chatName } = req.body;
  
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});


const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const deleteChat = expressAsyncHandler(async (req,res)=>{
  const chatId = req.params.chatId;
 
  try {
    const newChat = await Chat.findByIdAndUpdate(chatId,{
      latestMessage : undefined,
    },{
      new:true,
    })
    const deletedChat = await Message.deleteMany({chat : chatId});

    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(200).json({ message: 'Chat deleted successfully', deletedChat });
  } catch (error) {
    console.error('Error deleting chat:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
})

const findGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;
  
  try {
   
    const chat = await Chat.findById(chatId); // Corrected to findById for searching by _id    
    if (!chat) {
      return res.status(404).send({ message: 'Chat not found' });
    }
    
    res.status(200).send(chat);
  } catch (error) {
    console.error('Error finding chat:', error);
    res.status(500).send({ message: 'Server error' });
  }
});


module.exports = {accessChat, fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup,deleteChat,fetchGroupChats,findGroupChat};