import React ,{useEffect, useRef, useState} from 'react'
import "./style.css"
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageOther from './MessageOther';
import MessageSelf from './MessageSelf';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../Context/ChatProvider';
import AlertDialog from './AlertDialog';
import EditIcon from '@mui/icons-material/Edit';
import FormDialog from './FormDialog';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'

function WorkArea() {
  const lightTheme = useSelector((state)=>state.themeKey);
  const [fullConversation,setConversation] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const {_id ,name } = useParams(); 
  const {refresh,setRefresh}= useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [renameRefresh,setRenameRefresh] = useState(false);
  const [currentChat,setCurrentChat] = useState(null);
  const [socketConnected,setSocketConnected] = useState(false);
  const [typing,setTyping] = useState(false);
  const [istyping,setIsTyping] = useState(false);

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let light_dark_mode = (lightTheme ? "" : " <dark></dark>");
  const chatEndRef = useRef(null);

  const ENDPOINT =  "https://chatnow-wfsx.onrender.com" //"http://localhost:5000";
  var socket , selectedChatCompare;

  
  socket = io(ENDPOINT);

  useEffect(() => {
    // Wait for socket to be initialized and connected
    if (socket) {
      socket.emit("setup",userInfo);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
    }
  }, []); 

  const config = {
    headers : {
      Authorization : `Bearer ${userInfo.token}`,
    }
  }
  useEffect(()=>{
    const fetchConversations = async()=>{
      try{
        const {data} = await axios.get(`/messages/${_id}/${name}`,config);
        setConversation(data);
        socket.emit("join_chat", _id);
      }catch(error){
        console.error("Not able to fetch Conversations" , error.message);
      }
    }
    
    fetchConversations();
    
  },[_id,name,refresh]);
  // {console.log(fullConversation)}


  const sendMessage = async () => {
    if(messageContent!=="" || messageContent!==" "){
      
        setMessageContent('');
        const {data } = await axios.post("/messages/",
          {
            content: messageContent,
            chatId: _id,
          },
          config
        )
        setRefresh(!refresh);
        
        
        socket.emit("new message",data);
        socket.emit("doRefresh");
        setConversation(prevConversation => [...prevConversation, data]);
    }
  };

  const typingHandler = (e) => {
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", _id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 1000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", _id);
        setTyping(false);
      }
    }, timerLength);
  };
  // console.log(istyping);
  
  useEffect(() => {
    // Execute code dependent on socket being connected
    if (socketConnected && socket) {
      socket.on("doingRefresh", () => {
        setRefresh(prev => !prev);
        setRenameRefresh(prev => !prev);
      });
    }
  }, [socketConnected, socket]);

  useEffect(() => { 
    socket.on("messageRecieved", (newMessageRecieved) => { 
    setConversation(prevConversation => [...prevConversation, newMessageRecieved]);
    });
  });

  const renameGroup = async(newName)=>{
    try {
      const {data} = await axios.put("/chat/rename",{
        chatId : _id,
        chatName : newName,
      },config)
      setRefresh(!refresh);
      setRenameRefresh(!renameRefresh);
      socket.emit("doRefresh");
    } catch (error) {
      console.error("Not able to rename the group");
    }
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseDialog = ()=>{
    setOpenDialog(false);
  }
  const handleCloseForm= ()=>{
    setOpenForm(false);
  }
  const deleteChat = async ()=>{
    try {
      const {data} = await axios.delete(`/chat/deleteChat/${_id}`);
      setRefresh(!refresh); 
    } catch (error) {
      console.error("Not able to delete chat",error);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [fullConversation]);


  //just to have data about the whole current chat
  useEffect(()=>{
    const  fetchCurrentChat = async ()=>{
      try {
        const {data} = await axios.post("/chat/findchat",
        {chatId : _id},config);
        if(data.isGroupChat){
          navigate(`/app/chat/${data._id}/${encodeURIComponent(data.chatName)}`);
        }
        setCurrentChat(data);
        // debugger;
      } catch (error) {
        console.error("Not able to fetch on the basis of chatID" ,error)
      }
    }
    fetchCurrentChat();
  },[renameRefresh,_id])

  return (
    <div className={'workArea' + (lightTheme ? "" : " dark-background")}>
      <div className={'forChatTitle' + (lightTheme ? "" : " dark")}>
        <p className='con-icon'>{name[0].toUpperCase()}</p>
        
        <div className='current-user'>
            <p className='con-name'>{name}</p>
            <p className='con-last-message'>Online</p>
        </div>

        <div className='del-button'>
            {currentChat != null && currentChat.isGroupChat && (  
              <>
                <IconButton onClick={() => setOpenForm(true)}>
                    <EditIcon/>
                </IconButton>
                <FormDialog open={openForm} handleClose={handleCloseForm} renameGroup={renameGroup} />
              </>
            )}

          <IconButton onClick={() => setOpenDialog(true)}>
          <DeleteIcon />
        </IconButton>
        {<AlertDialog  open={openDialog} handleClose={handleCloseDialog} handleAgree = {deleteChat} message = "Are you sure you want to delete the chat?"/>}
        </div>
      </div>
      <div className={'forChatBox' + light_dark_mode} >
          {fullConversation.map((message,index) => {
              const sender = message.sender;
              const self_id = userInfo._id;
              if (sender._id === self_id) {
                // console.log("I sent it ");
                return <MessageSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessageOther props={message} key={index} />;
              }
          })}
        <div ref={chatEndRef}></div>
      </div>
      {/* {istyping ? <div> Typing....</div> : <></> } */}
      <div className={'type-box' + light_dark_mode}>
          <input placeholder={"Type a Message"} value={messageContent} className={'search-box'+ light_dark_mode} 
            onChange={(e)=>{setMessageContent(e.target.value)}}
          onKeyDown = {(e)=>{
            if(e.code === "Enter"){
              sendMessage();
            }
          }} 
        />
          <div className='send-button' onClick={sendMessage}>
            <IconButton>
              <SendIcon/>
            </IconButton>
          </div>
      </div>
    </div>
  )
}

export default WorkArea
