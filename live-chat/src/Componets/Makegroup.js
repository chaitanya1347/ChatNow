import React, { useState } from 'react'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Makegroup() {
  const navigate = useNavigate();
  const [groupName,setgroupName] = useState("");
  return (
    <div className='make-group-container'>
        <div className='input-container'>
        <input placeholder='Enter Group Name' className='search-box' onChange={(e)=>{
          setgroupName(e.target.value);
        }}/>
        <IconButton className='icon-button' onClick={()=>{
          navigate("/app/group_members",{state : {groupName}});
        }}>
            <DoneOutlineIcon/>
        </IconButton>

        </div>
    </div>
  )
}

export default Makegroup
