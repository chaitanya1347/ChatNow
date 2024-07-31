const expres = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandlingMiddlewares");
const path = require("path");

const app = expres();
dotenv.config();
app.use(expres.json());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const connectDb  = async ()=>{
    try {
        const connect = await mongoose.connect(MONGO_URI);
        console.log("The Server is Connected"); 
    } catch (err) {
        console.log("The Server is Not Connected",err.message);
    }   
}
    
connectDb();

app.use('/user',userRoutes); 
app.use('/chat',chatRoutes);
app.use("/messages", messageRoutes);

// ---------------------------------------------Deployment--------------------------------

const __dirname1 = path.resolve(__dirname, '../');  
if(process.env.NODE_ENV === 'production'){
    app.use(expres.static(path.join(__dirname1, 'live-chat/build')));
    app.get('*', (req, res) => {
        const fs= path.join(__dirname1, 'live-chat','build', 'index.html');
        console.log(fs)
      res.sendFile(path.join(__dirname1, 'live-chat','build', 'index.html'));
    }); 

}else{
    app.get('/', (req, res) => {
        res.send("Server is Running in Development Mode");
    })
}

// ---------------------------------------------Deployment--------------------------------

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT);

const io = require('socket.io')(server,{
    pingTimeout: 60000, 
     cors: {
       origin: "*",
     }
})
 
io.on("connection",(socket)=>{
    // console.log("socket connection");
    
    socket.on("setup",(userData)=>{
        socket.join(userData._id); 
        socket.emit("connected");    
    });
    socket.on("join_chat",(room)=>{
        socket.join(room);
        socket.emit("connected");  
        // console.log(socket.id)
    })

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("messageRecieved", newMessageRecieved);
      });
    });
    
    socket.on("typing", (room) => socket.to(room).emit("typing"));
    socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

    socket.on('newChatCreated', (data) => {
        io.emit('chatReceived');
    });

    socket.on('doRefresh', () => {
        io.emit('doingRefresh');
    });
})