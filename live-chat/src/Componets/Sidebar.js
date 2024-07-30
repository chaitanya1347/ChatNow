import React, { useEffect, useState } from 'react'
import "./style.css"
import NoMessageImage from './No-messages.jpeg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Conversations from './Conversations';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import LightModeIcon from '@mui/icons-material/LightMode';
import axios from 'axios';
import { AnimatePresence ,motion} from 'framer-motion';
import { useData } from '../Context/ChatProvider';
import AlertDialog from './AlertDialog';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar() {
  let navigate = useNavigate();
  const lightTheme = useSelector((state)=>state.themeKey);
  const dispatch = useDispatch();
  const light_dark_mode = (lightTheme ? "" : " dark");
  const light_dark_icons = lightTheme ? "" : "dark-icon";
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [conversations , setConversations] = useState([]);
  const {refresh,setRefresh} = useData();
  const [logOut,setLogOut] = useState(false);

  const handleCloseDialog = ()=>{
    setLogOut(false);
  }
  const logOutYourself = ()=>{
    localStorage.removeItem('userInfo');
    navigate("/");
  }

  //this store all covo that are displayed in sidebar tab
  useEffect (()=>{
      const fetchData = async ()=>{
          try{
          const config = {
            headers  : {
              Authorization : `Bearer ${userInfo.token}`,
            }, 
          }
          const {data} = await axios.get("/chat",config)
          setConversations(data);
        }catch(error){
          console.log(error.message); 
      }
    }

    fetchData();
  },[refresh]);

  const getName = (conversation) => {
    if (conversation.isGroupChat) {
      return conversation.chatName;
    } else {
      let chatName = '';
      conversation.users.forEach((user) => {
        if (user._id !== userInfo._id) {
          chatName = user.name;
        }
      });
      return chatName;
    }
  };

  return (
    <div className={'sidebar' + (lightTheme ? "" : " dark-background")}>
      <div className={'for-icons' + light_dark_mode}>
        <div className='AccountCircle'>
        <IconButton className={light_dark_icons} onClick={() => setLogOut(true)}>
          <LogoutIcon/>
        </IconButton>
        {<AlertDialog  open={logOut} handleClose={handleCloseDialog} handleAgree = {logOutYourself} message = "Are you sure you want to log out?"/>}
        </div>

        <div className='adding-icon'>
          <IconButton className={light_dark_icons} onClick={()=>{
            navigate('online_users')
          }}>
            <PersonAddIcon/>
          </IconButton>

          <IconButton className={light_dark_icons} onClick={()=>{
            navigate('groups')
          }}>
            <GroupAddIcon/>
          </IconButton>

          <IconButton className={light_dark_icons} onClick={()=>{
            navigate('make_groups')
          }}>
          <AddCircleIcon/>
          </IconButton>

        <IconButton className={light_dark_icons} onClick = {()=>{dispatch(toggleTheme())}}>
          {lightTheme && <DarkModeIcon/>}
          {!lightTheme && <LightModeIcon/>}
        </IconButton>
        </div>
      </div>

      <div className={'forSearch' + light_dark_mode}>
        <div className='searchIcon'>
        <IconButton className={light_dark_icons}>
          <SearchIcon/>
        </IconButton>
        </div>
        <input placeholder='search' className={'search-box'+ light_dark_mode} />
      </div>
        <div className={'conversations-area' + light_dark_mode}>
          {conversations.length === 0 ? (
                <div className="no-message-container">
                  <img src={NoMessageImage} alt="No conversations found" className='no-message' />
                </div>
          ) : (
          
          conversations.map((conversation) =>{
            const ChatName = getName(conversation);
            if(conversation.latestMessage === undefined  || conversation.latestMessage === null  ){
                return(
                  <AnimatePresence>
                  <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }}
                   className='conversation-box' onClick={()=>{
                    navigate(`chat/${conversation._id}/${encodeURIComponent(ChatName)}`);
                  }}> 
                      {(!isNaN(ChatName[0])) ? (
                        <p className='con-icon'>{ChatName[0]}</p>
                      ) : (
                        <p className='con-icon'>{ChatName[0].toUpperCase()}</p>
                      )}
                      <p className='con-name'>{ChatName}</p>
                      <p className='con-last-message'>No previous Messages, click here to start a new chat</p>
                  </motion.div>
                </AnimatePresence>
                )
            }else{
             
              return(
                <AnimatePresence>
                <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }}
                 className='conversation-box' onClick={()=>{
                  navigate(`chat/${conversation._id}/${encodeURIComponent(ChatName)}`);
                }}>
                    <p className='con-icon'>{ChatName[0].toUpperCase()}</p>
                    <p className='con-name'>{ChatName}</p>
                    <p className='con-last-message'>{conversation.latestMessage.content}</p>
                </motion.div>
              </AnimatePresence>)
            }
          } 
          ))
        }
      </div>
    </div>
  )
}

export default Sidebar
