import React from 'react'
import "./style.css"

function MessageSelf({props}) {

  const timeConversion = ()=>{
      const updatedAtString = props.createdAt;
      const updatedAtIST = new Date(updatedAtString);
      const istHours = updatedAtIST.getHours();
      const istMinutes = updatedAtIST.getMinutes();
      const formattedISTHours = String(istHours).padStart(2, "0");
      const formattedISTMinutes = String(istMinutes).padStart(2, "0");
      const istTimeString = `${formattedISTHours}:${formattedISTMinutes}`;
      return istTimeString;

  }
  return (
<div className='message-self-container'>
      <div className='messages'>
        {props.content}
      </div>
      <div className='message-time'>
        {timeConversion()}
      </div>
      <div className='message-status'>
         Sent
      </div>
    </div>
  )
}

export default MessageSelf
