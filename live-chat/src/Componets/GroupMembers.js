import React, { useEffect, useState } from 'react'
import {useData} from "../Context/ChatProvider"
import "./style.css"
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import logo from "./online-users.png"
import {AnimatePresence, motion} from "framer-motion";
import axios from 'axios';
import Toaster from './Toaster';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function GroupMembers() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [userData,setUserData] = useState([]);
    const {refresh,setRefresh}  = useData();
    const [userSearch,setUserSearch] = useState("");
    const [groupMembersList, setGroupMemberList] = useState([]);
    const [highlighted, setHighlighted] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [toasterTimeout, setToasterTimeout] = useState(null);
    const { state } = useLocation();
    const groupName = state.groupName;
    const navigate = useNavigate();

    const config = {
        headers :{
            Authorization : `Bearer ${userInfo.token}`,
        },
    }

    useEffect(()=>{
        const fetchSearchedUsers =async ()=>{
            try{
                const {data} = await axios.get('/user/register',{
                    params: {
                        search : userSearch,
                    },
                },config);
                setUserData(data);
            }catch(error){
                console.error("Not able to Search Users" ,error);
            }
        }
        
        fetchSearchedUsers();
    },[userSearch]);


const handleCloseToaster = () => {
        setShowToaster(false);
        clearTimeout(toasterTimeout); 
};

 const createGroupChat = async() =>{
        if(groupMembersList.length<2){
            console.log(groupMembersList);
            setShowToaster(true);
            setToasterTimeout(setTimeout(() => {
                setShowToaster(false); // Hide the toaster after 3 seconds (adjust as needed)
              }, 3000));
            return;
        }
        try {
            console.log(groupMembersList)
            const {data} = await axios.post("/chat/group" ,{
                    name : groupName,
                    users : groupMembersList,
            },config);
            console.log(data);
            setRefresh(!refresh);
            navigate("/app/groups");
        } catch (error) {
            console.error("Not Able to Create A group" , error);
        }
    }
    const addMembers = (user) => {
        const userExists =  groupMembersList.some((member) => member._id === user._id);
        if (userExists) {
            const updatedMembers = groupMembersList.filter((member) => member._id !== user._id);
            setGroupMemberList(updatedMembers);
        } else {
          
            setGroupMemberList([...groupMembersList, user]);
        }
       
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
            <div className='ug-group-header'>
                <p className='ug-title'>Select members that you want to add</p>
            </div>
            <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }} className='ug-group-header' onClick={()=>{
                createGroupChat();
            }}> 
                <p className='ug-title'>Create Group</p>
            </motion.div>
            {showToaster && <Toaster onClose={handleCloseToaster} severity="warning"  message="Please add atleast 2 members"  />}
            <div className='sb-search'>
                <IconButton>
                    <SearchIcon/>
                </IconButton>
                <input placeholder='Search user' className='search-box' onChange={(e)=>{
                    setUserSearch(e.target.value);
                }}/>

            </div>
            
            <div className='ug-list'>
                    {userData.map((user)=>{
                        if(user._id!=userInfo._id){
                            const userExists = groupMembersList.some((member) => member._id === user._id);
                            return(
                                <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }} 
                                    className= {"lst-items" + (userExists ? ' highlighted' : "")} onClick={()=>{
                                    addMembers(user);
                                }}>
                                    <p className='con-icon'>{user.name[0].toUpperCase()}</  p>
                                    <p className='con-name'>{user.name}</p>
                                </motion.div>
                        
                        )}
                     })} 
            </div>
            
        </motion.div>
        </AnimatePresence>
  )
}

export default GroupMembers
