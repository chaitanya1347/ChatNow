import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({children})=>{
    const [user,setUser] = useState();
    const [refresh,setRefresh] = useState(false);
    const history = useNavigate();  
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            history('/');
        }
    },[history])
    return <chatContext.Provider value={{refresh,setRefresh}}>
        {children}
    </chatContext.Provider>
}
export const useData = () => {
    const context = useContext(chatContext);
    if (!context) {
      throw new Error("useData must be used within a ChatProvider");
    }
    return context;
  };
export default ChatProvider;