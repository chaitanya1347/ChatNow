import React from 'react'
import "./style.css"
import PortraitIcon from '@mui/icons-material/Portrait';
import { useNavigate } from 'react-router-dom';
import {AnimatePresence, motion} from "framer-motion";

function Conversations({props}) {
  let navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98 }}
       className='conversation-box' onClick={()=>{
        navigate('chat')
      }}>
          <p className='con-icon'>{props.name[0]}</p>
          <p className='con-name'>{props.name}</p>
          {/* <p className='con-last-message'>{props.lastMessage}</p> */}
          {/* <p className='con-timestamp'>{props.timeStamp}</p> */}
      </motion.div>
    </AnimatePresence>
  )
}

export default Conversations
