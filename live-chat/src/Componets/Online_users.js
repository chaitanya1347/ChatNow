import React, { useEffect, useState } from 'react';
import { useData } from "../Context/ChatProvider";
import "./style.css";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import logo from "./online-users.png";
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
function Online_users() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [userData, setUserData] = useState([]);
    const { refresh, setRefresh } = useData();
    const [userSearch, setUserSearch] = useState("");
    const navigate = useNavigate();

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    var socket;
    const ENDPOINT =  "https://chatnow-wfsx.onrender.com" //"http://localhost:5000";
    
    socket = io(ENDPOINT);
    useEffect(()=>{
      socket.emit("setup",userInfo);
      socket.on("connection"); 
    },[])

    // Fetch users based on search input
    useEffect(() => {
        const fetchSearchedUsers = async () => {
            try {
                const { data } = await axios.get('/user/register', {
                    params: {
                        search: userSearch,
                    },
                }, config);
                setUserData(data);
            } catch (error) {
                console.error("Not able to Search Users", error);
            }
        };

        fetchSearchedUsers();
    }, [userSearch, userInfo.token]); // Include userInfo.token as dependency

    // Function to create a chat with a user
    const showChat = async (user) => {
        try {
            const { data } = await axios.post("/chat", {
                userId: user._id,
            }, config);
            setRefresh(!refresh);
            socket.emit('newChatCreated',data);
            // Return the data to use it elsewhere if needed
            return data;
        } catch (error) {
            console.error("Not Able to Access Chat", error);
            return null;
        }
    };

    useEffect(() => {
        socket.on("chatReceived", () => {
            setRefresh(!refresh);
        });
    });

    // Function to get the name of the conversation
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
        height: "2.5rem",
        width: "2.5rem"
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                    ease: "linear",
                    duration: "0.3"
                }}
                className='list-container'>
                <div className='ug-header'>
                    <img src={logo} style={img_style} alt="Welcome page " />
                    <p className='ug-title'>Online Users</p>
                </div>

                <div className='sb-search'>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <input placeholder='Search user' className='search-box' onChange={(e) => {
                        setUserSearch(e.target.value);
                    }} />

                </div>

                <div className='ug-list'>
                    {userData.map((user) => {
                        if (user._id !== userInfo._id) {
                            return (
                                <motion.div key={user._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='lst-items' onClick={async () => {
                                    const chatData = await showChat(user);
                                    const ChatName = getName(chatData); // Ensure chatData is used here
                                    navigate(`/app/chat/${chatData._id}/${encodeURIComponent(ChatName)}`);
                                }}>
                                    <p className='con-icon'>{user.name[0].toUpperCase()}</p>
                                    <p className='con-name'>{user.name}</p>
                                </motion.div>
                            );
                        } else {
                            return null; // Don't render current user in the list
                        }
                    })}
                </div>

            </motion.div>
        </AnimatePresence>
    );
}

export default Online_users;
