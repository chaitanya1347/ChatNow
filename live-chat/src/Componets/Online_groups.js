import React, { useEffect, useState } from 'react'
import {useData} from "../Context/ChatProvider"
import "./style.css"
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import logo from "./online-users.png"
import {AnimatePresence, motion} from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Online_groups() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [userData,setUserData] = useState([]);
    const {refresh,setRefresh}  = useData();
    const [userSearch,setUserSearch] = useState("");
    const navigate = useNavigate();
    const config = {
        headers :{
            Authorization : `Bearer ${userInfo.token}`,
        },
    }

    // it is just to show group on available groups section uses CHAT MODEL
    useEffect(()=>{
        const fetchSearchedUsers =async ()=>{
            try{
                const {data} = await axios.get('/chat/group',{
                    params: {
                        search : userSearch,
                        userId : userInfo._id,
                    },
                }   );
                setUserData(data);
            }catch(error){
                console.error("Not able to Search Users" ,error);
            }
        }
        
        fetchSearchedUsers();
    },[userSearch]);

    
    //this Create a single chat in CHAT DATABASE
    const showChat = async (chat)=>{
        try{
            const {data}  = await axios.post("/chat",{
                userId : chat._id
            },config);
            setRefresh(!refresh);
            return data;
        }catch(error){
            console.error("Not Able to Access Chat",error);
            return null;
        }
    }
    const getName = (conversation) => {
        if (!conversation) return ''; // Handle case where conversation is null or undefined

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

    let img_style = {
        height:"2.5 rem",
        width:"2.5rem"
    };

  return (
        <AnimatePresence>
        <motion.div initial={{scale:0,opacity:0}}
                    animate={{scale:1,opacity:1}}
                    exit={{scale:0,opacity:0}}
                    transition={{
                        ease:"linear",
                        duration:"0.3"
                    }}
                   className='list-container'>
            <div className='ug-header'>
                <img src= {logo} style= {img_style} alt="Welcome page " />
                <p className='ug-title'>Online Groups</p>
            </div>

            <div className='sb-search'>
                <IconButton>
                    <SearchIcon/>
                </IconButton>
                <input placeholder='Search user' className='search-box' onChange={(e)=>{
                    setUserSearch(e.target.value);
                }}/>

            </div>

            <div className='ug-list'>
                    
                    {userData.map((chat)=>{
                            return(
                            <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }} className='lst-items' onClick={async ()=>{
                                        const chatData = await showChat(chat);
                                        const ChatName = getName(chatData); // Ensure chatData is used here
                                        navigate(`/app/chat/${chatData._id}/${encodeURIComponent(ChatName)}`);
                                    }
                                }>
                                <p className='con-icon'>{chat.chatName[0].toUpperCase()}</p>
                                <p className='con-name'>{chat.chatName}</p>
                            </motion.div>
                        )
                     })} 
            </div>
        </motion.div>
        </AnimatePresence>
  )
}

export default Online_groups
