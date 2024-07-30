import React from 'react'
import "./style.css"
function MessageOther({props}) {
const timeConversion = (updatedAtString)=>{
        const updatedAtIST = new Date(updatedAtString);
        const istHours = updatedAtIST.getHours();
        const istMinutes = updatedAtIST.getMinutes();
        const formattedISTHours = String(istHours).padStart(2, "0");
        const formattedISTMinutes = String(istMinutes).padStart(2, "0");
        const istTimeString = `${formattedISTHours}:${formattedISTMinutes}`;
        return istTimeString;
  
}

  return (
        <div className='message-other'>
                <p className='con-icon'>{props.sender.name[0].toUpperCase()}</p>
                <div className='message-other-container'>
                    <div className='message-content'>
                        <div className='user-name'>
                            {props.sender.name}
                        </div>
                        <div className='sample-message-other'>
                        {props.content}
                        </div>
                    </div>
                    <div className='message-time'>
                        {timeConversion(props.createdAt)}
                    </div>
                </div>
        </div>
  )
}

export default MessageOther
